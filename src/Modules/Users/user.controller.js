import { Router } from "express";
import * as UC from "./Services/user.service.js";
import { authenticationMiddleWare } from "../../Middleware/authentication.middleware.js";
import { authorizationMiddleware } from "../../Middleware/authorization.middleware.js";
import { Privillages, RolesEnum } from "../../common/user.enum.js";

const router = Router();


router.post('/signup', UC.SignUpService);
router.post('/signin', UC.SignInService);
router.put('/updateUser', authenticationMiddleWare, UC.UpdateUserService);
router.post('/logout', authenticationMiddleWare, UC.LogoutService);
router.post('/refreshtoken', UC.RefreshTokenService);
router.delete('/deleteUser/:userId', authenticationMiddleWare, UC.DeleteUserService);
//router.get('/listUsers', UC.ListUserService);
router.put('/confirm', UC.ConfirmEmailService);

//Admin Routes
//router.get('/listAdmin',authenticationMiddleWare,authorizationMiddleware([RolesEnum.ADMIN,RolesEnum.SUPER_ADMIN]),UC.ListUserService)
router.get('/listAdmin',authenticationMiddleWare,authorizationMiddleware([Privillages.ADMIN]),UC.ListUserService)

export default router;