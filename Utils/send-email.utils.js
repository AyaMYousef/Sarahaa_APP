
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();


export const sendEmail = async (
    {
        to,
        cc = '',
        subject,
        content,
        attachments = []
    }
) => {

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', //smtp.gmail.com or localhost
        port: 465,
        secure: true,
        auth: {
            user: process.env.AUTH_EMAIL,
            pass: process.env.AUTH_PASS

        },
    })

    const info = await transporter.sendMail({
        from: process.env.AUTH_EMAIL,
        to,
        cc,
        subject,
        html: content,
        attachments: []
    })

    console.log(`info`, info);

    return info;
}