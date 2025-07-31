import { Router } from "express";
import * as UC from "./Services/user.service.js";

const userRouter = Router();


userRouter.post('/addUser', UC.SignUpService);
userRouter.post('/signin', UC.SignInService);
userRouter.put('/updateUser/:userId', UC.UpdateUserService);
userRouter.delete('/deleteUser/:userId', UC.DeleteUserService);
userRouter.get('/listUsers', UC.ListUserService);
userRouter.put('/confirm', UC.ConfirmEmailService);



export default userRouter;