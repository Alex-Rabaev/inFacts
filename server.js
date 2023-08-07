import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
// import mongoose from "mongoose";
import users_router from "./routes/usersRoute.js"; 
import posts_router from "./routes/postsRoute.js";

import path from "path";
import ejs from "ejs";
import cors from 'cors';
import multer from "multer";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"))

app.use(express.urlencoded({ extended: true }));
const upload = multer();
app.use(upload.array());

app.use(cookieParser());

app.set('view engine', 'ejs');

app.use(cors());


app.use("/api/users", users_router);
app.use("/api/posts", posts_router);

app.listen(process.env.PORT, () => {
    console.log(`Backend server is running on port ${process.env.PORT}`);
})
