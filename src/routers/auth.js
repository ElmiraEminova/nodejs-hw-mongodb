import { Router } from "express";
import { validateBody } from "../utils/validateBody.js";
import { userSignUpSchema, userSignInSchema, sendResetEmailSchema, resetPasswordSchema } from "../validation/users.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { signupController, signinController, refreshController, signoutController, sendResetEmailController, resetPasswordController } from "../controllers/auth.js";

const authRouter = Router();
authRouter.post("/register", validateBody(userSignUpSchema), ctrlWrapper(signupController));
authRouter.post("/login", validateBody(userSignInSchema), ctrlWrapper(signinController));
authRouter.post("/refresh", ctrlWrapper(refreshController));
authRouter.post("/logout", ctrlWrapper(signoutController));
authRouter.post("/send-reset-email", validateBody(sendResetEmailSchema), ctrlWrapper(sendResetEmailController));
authRouter.post("/reset-password", validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController),
);

export default authRouter;
