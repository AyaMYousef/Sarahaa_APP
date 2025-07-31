import crypto from 'node:crypto';
import dotenv from "dotenv";
import fs from 'node:fs'
dotenv.config();


//To convert to Buffer Like
const IV_LENGTH = parseInt(process.env.IV_LENGTH, Number(process.env.IV_LENGTH_NUMBER));
const ENCRYPTION_SECRET_KEY = Buffer.from(process.env.ENCRYPTION_SECRET_KEY, 'utf-8');

//Encrption
export const encrypt = (text) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_SECRET_KEY, iv);

    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
};



//Decryption
export const decrypt = (encryptedText) => {
    const [ivHex, encryptedData] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_SECRET_KEY, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
};

//Asymmetric 

//publickey => Encryption
//PrivateKey => decryption
if (!fs.existsSync('publickey.pem') || !fs.existsSync('privatekey.pem')) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    });

    fs.writeFileSync('publickey.pem', publicKey);
    fs.writeFileSync('privatekey.pem', privateKey);
}

// Asymmetric Encryption
export const asymmetricEncryption = (text) => {
    const publicKey = fs.readFileSync('publickey.pem', 'utf-8');
    const bufferedText = Buffer.from(text);

    const encryptedData = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        },
        bufferedText
    );

    return encryptedData.toString('hex');
};

// Asymmetric Decryption
export const asymmetricDecryption = (text) => {
    const privateKey = fs.readFileSync('privatekey.pem', 'utf-8');


    const decryptedData = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        },
        Buffer.from(text, 'hex')
    );

    return decryptedData.toString('utf-8');
};