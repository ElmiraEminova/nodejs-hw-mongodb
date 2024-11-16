import fs from 'node:fs';
import path from 'node:path';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import { randomBytes } from 'crypto';
import userCollection from '../db/Users.js';
import SessionCollection from '../db/Session.js';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constans/users.js';
import { sendMail } from '../utils/sendMail.js';

const RESET_PASSWORD_TEMPLATE = fs.readFileSync(
  path.resolve('src/templates/reset-password.hbs'),
  { encoding: 'utf-8' },
);

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenTime = new Date(Date.now() + accessTokenLifeTime);
  const refreshTokenTime = new Date(Date.now() + refreshTokenLifeTime);

  return {
    accessToken,
    refreshToken,
    accessTokenTime,
    refreshTokenTime,
  };
};

export const signup = async (payload) => {
  const { email, password } = payload;
  const user = await userCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const data = await userCollection.create({
    ...payload,
    password: hashPassword,
  });
  delete data._doc.password;
  return data._doc;
};

export const signin = async (payload) => {
  const { email, password } = payload;
  const user = await userCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email invalid');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Password invalid');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const sessionData = createSession();

  const userSession = await SessionCollection.create({
    userId: user._id,
    ...sessionData,
  });

  return userSession;
};

export const findSessionByAccessToken = (accessToken) =>
  SessionCollection.findOne({ accessToken });

export const refreshSession = async ({ refreshToken, sessionId }) => {
  const oldSession = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionCollection.deleteOne({ _id: sessionId });

  const sessionData = createSession();

  const userSession = await SessionCollection.create({
    userId: oldSession.userId,
    ...sessionData,
  });

  return userSession;
};

export const signout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const findUser = (filter) => userCollection.findOne(filter);

export const sendResetEmail = async (email) => {
  const user = await userCollection.findOne({ email });

  if (user === null) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    { sub: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '5m' },
  );

  const html = handlebars.compile(RESET_PASSWORD_TEMPLATE);
  const appHost = process.env.APP_DOMAIN;

  try {
    await sendMail({
      from: 'asanovaelis@gmail.com',
      to: email,
      subject: 'Reset your password',
      html: html({ resetToken, appHost }),
    });
  } catch (error) {
    console.error(error);

    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export async function resetPassword(password, token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userCollection.findOne({
      _id: decoded.sub,
      email: decoded.email,
    });

    if (user === null) {
      throw createHttpError(404, 'User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userCollection.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }

    throw error;
  }
}

export const loginOrRegisterUser = async (payload) => {
  let user = await userCollection.findOne({ email: payload.email });

  if (user === null) {
    const password = await bcrypt.hash(randomBytes(30).toString('base64'), 10);

    const createdUser = await userCollection.create({
      name: payload.name,
      email: payload.email,
      password,
    });

    const sessionData = createSession();

    return SessionCollection.create({
      userId: createdUser._id,
      ...sessionData,
    });
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const sessionData = createSession();

  return SessionCollection.create({
    userId: user._id,
    ...sessionData,
  });
};
