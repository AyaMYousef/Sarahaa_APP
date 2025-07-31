import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbConnection = async () => {
    try {
        // timeout for DB connection
        await mongoose.connect(process.env.DB_URL, { serverSelectionTimeoutMS: 5000 })
        console.log('Connected to DB successfully');
    }
    catch (error) {
        console.log('DataBase failed to connect', error);
    }
}

export default dbConnection;