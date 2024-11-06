import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from "./utils/env.js";
import cookieParser from 'cookie-parser';

import { contactsRouter } from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import authRouter from './routers/auth.js';

export const setupServer = () => {
    const app = express();
    const logger = pino({
        transport: {
            target: "pino-pretty"
        }
    });

    app.use(logger);
    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());

    app.use("/auth", authRouter);

    app.use("/contacts", contactsRouter);

    app.use(notFoundHandler);
    app.use(errorHandler);

    const port = Number(env("PORT", 4000));

    app.listen(port, () => console.log(`Server is running on port ${port}`)
    );
};
