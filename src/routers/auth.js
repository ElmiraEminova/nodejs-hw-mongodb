import { Router } from "express";
import { validateBody } from "../utils/validateBody.js";
import { userSignUpSchema, userSignInSchema } from "../validation/users.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { signupController, signinController, refreshController, signoutController } from "../controllers/auth.js";

const authRouter = Router();
authRouter.post("/register", validateBody(userSignUpSchema), ctrlWrapper(signupController));
authRouter.post("/login", validateBody(userSignInSchema), ctrlWrapper(signinController));
authRouter.post("/refresh", ctrlWrapper(refreshController));
authRouter.post("/logout", ctrlWrapper(signoutController));

export default authRouter;
