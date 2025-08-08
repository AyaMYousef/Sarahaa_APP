import { verifyToken } from "../../Utils/tokens.utils.js";
import BlackListedToken from "../DB/Models/black-listed-tokens.model.js";
import User from "../DB/Models/user.model.js"



export const authenticationMiddleWare = async (req, res, next) => {

    const { accesstoken } = req.headers
    if (!accesstoken)
        return res.status(400).json({ message: "Please LogIn first" });

    //Verify Token
        const decodedData = verifyToken(accesstoken, process.env.JWT_ACCESS_SECRET)



    if (!decodedData.jti) {
        return res.status(401).json({ message: "Invalid token" });
    }

    //check if token is BlackListed
    const blackListedToken = await BlackListedToken.findOne({ tokenId: decodedData.jti })

    if (blackListedToken) {
        return res.status(401).json({ message: "Token is BlackListed" })
    }

    //get user data from DataBase

    const user = await User.findById(decodedData?._id);


    console.log("Decoded Token:", decodedData);
    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    req.loggedUser = { user, token: { tokenId: decodedData.jti, expirationDate: decodedData.exp } }

    next()
}