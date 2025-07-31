import express from "express"
import userRouter from './src/Modules/Users/user.controller.js'
import messageRouter from './src/Modules/Messages/message.controller.js'
import dbConnection from "./src/DB/db.connection.js";

import dotenv from 'dotenv';
dotenv.config();



const app = express();
app.use(express.json());

//Routes
app.use('/api/users', userRouter);
app.use("/api/messages", messageRouter);


//dbConnection
dbConnection()

//Error Handling MiddleWare
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(err.cause || 500).json({ message: "Internal Server Error", error: err.message, stack: err.stack });
});

//404 error
app.use((req, res) => {
    res.status(404).send("Not Found");
});


// server listener
app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
})

