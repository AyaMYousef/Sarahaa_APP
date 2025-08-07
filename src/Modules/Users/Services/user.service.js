
import { encrypt, decrypt, asymmetricDecryption, asymmetricEncryption } from '../../../../Utils/encryption.utils.js';
import { sendEmail } from '../../../../Utils/send-email.utils.js';
import User from '../../../DB/Models/user.model.js'
import bcrypt from "bcrypt";
import { customAlphabet, nanoid } from 'nanoid';
import EventEmitter from 'events';
import { v4 as uuidv4 } from 'uuid';
import BlackListedToken from "../../../DB/Models/black-listed-tokens.model.js";

import dotenv from 'dotenv';
import { generateToken, verifyToken } from '../../../../Utils/tokens.utils.js';
dotenv.config();

const uniqueString = customAlphabet(process.env.NANO_ID_STRING, Number(process.env.NANO_ID_NUMBER));
const emitter = new EventEmitter();

export const ConfirmEmailService = async (req, res, next) => {
    const { email, otp } = req.body


    const user = await User.findOne({ email, isConfirmed: false })
    if (!user) {
        // return res.status(400).json({ message: 'User not found or already confirmed' })
        return next(new Error('User not found or already confirmed', { cause: 400 }));
    }
    const isOtpMatched = bcrypt.compareSync(otp, user.otps?.confirmation);
    if (!isOtpMatched) {
        return res.status(400).json({ message: 'OTP invalid' });
    }

    user.isConfirmed = true
    user.otps.confirmation = undefined

    await user.save()
    res.status(200).json({ message: 'confirmed' })
}

export const SignUpService = async (req, res) => {
    try {
        const { firstName, lastName, email, password, age, gender, phoneNumber } = req.body;

        // Check if user exists
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Validate phone
        if (!phoneNumber) {
            return res.status(400).json({ message: "Phone number is required" });
        }

        // Encrypt sensitive data
        const encryptPhoneNumber = asymmetricEncryption(String(phoneNumber));
        const hashedPassword = await bcrypt.hash(password, Number(process.env.USER_SALTED_HASH));
        const otp = uniqueString();

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            age,
            gender,
            phoneNumber: encryptPhoneNumber,
            otps: { confirmation: await bcrypt.hash(otp, Number(process.env.USER_SALTED_HASH)) }
        });

        const { password: _, ...safeUser } = user.toObject();

        // Send confirmation email
        await sendEmail({
            to: email,
            subject: 'Confirmation Email',
            content: `Your confirmation OTP is: ${otp}`
        });

        return res.status(201).json({ message: "User created successfully", user: safeUser });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
//Sign In
export const SignInService = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email);
        console.log(password);

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(409).json({ message: "Sign up instead" });
        }

        const isMatch = await bcrypt.compare(String(password), user.password);
        console.log(user.password);
        console.log(isMatch)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        //Generate token for the loggedIn User

        const accesstoken = generateToken(

            { _id: user._id, email: user.email },
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
                jwtid: uuidv4()
            }
        )

        return res.status(200).json({ message: "User logged in successfully", accesstoken });
    }
    catch (error) {
        return res.status(500).json({ message: "Error occurred", error: error.message });
    }
}
//Update 

export const UpdateUserService = async (req, res) => {
    try {
        console.log(req.loggedUser)
        const { _id } = req.loggedUser;
        const { firstName, lastName, email, age, gender } = req.body

        //find user
        const user = await User.findByIdAndUpdate(
            _id,
            { firstName, lastName, email, age, gender },
            { new: true }

        )
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        /* if (firstName)
             user.firstName = firstName;
         if (lastName)
             user.lastName = lastName;
         if (email) {
             const isEmailExist = await User.findOne({ email })
             if (isEmailExist) {
                 return res.status(409).json({ message: "User already exist" });
             }
             user.email = email;
         }
         if (age)
             user.age = age;
         if (gender)
             user.gender = gender;
 
         await user.save()*/
        return res.status(200).json({ message: "User updated successfully", user });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal error occurred', error: error.message });
    }
};

//delete User

export const DeleteUserService = async (req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        return res.status(200).json({ message: "Deleted Successfully" });

    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });

    }
};

//List Users

export const ListUserService = async (req, res) => {
    let users = await User.find();
    users = users.map((user) => {
        return {
            ...user._doc,
            phoneNumber: asymmetricDecryption(user.phoneNumber)
        }
    })

    res.status(200).json({ users });
};

// black listed tokens

export const LogoutService = async (req, res) => {

    const { accesstoken } = req.headers
    const decodedData = verifyToken(accesstoken, process.env.JWT_ACCESS_SECRET)

    // convert expiration field into date format

    const expirationDate = new Date(decodedData.exp * 1000)

    const blackListedToken = await BlackListedToken.create({
        tokenId: decodedData.jti,
        expirationDate
    });

    return res.status(200).json({ message: "User logged out successfully" });

}