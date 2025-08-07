import { Router } from "express";
import * as UC from "./Services/user.service.js";
import { authenticationMiddleWare } from "../../Middleware/authentication.middleware.js";

const userRouter = Router();


userRouter.post('/signup', UC.SignUpService);
userRouter.post('/signin', UC.SignInService);
userRouter.put('/updateUser',authenticationMiddleWare, UC.UpdateUserService);
userRouter.post('/logout', UC.LogoutService);
userRouter.delete('/deleteUser/:userId', UC.DeleteUserService);
userRouter.get('/listUsers', UC.ListUserService);
userRouter.put('/confirm', UC.ConfirmEmailService);



export default userRouter;