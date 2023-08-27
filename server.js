import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
// import mongoose from "mongoose";
import users_router from "./routes/usersRoute.js"; 
import posts_router from "./routes/postsRoute.js";
import facts_router from "./routes/factsRoute.js";
import topics_router from "./routes/topicsRoute.js";
import conversations_router from "./routes/conversationsRoute.js";
import messages_router from "./routes/messagesRoute.js";
import files_router from "./routes/upload.routes.js";

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import ejs from "ejs";
import cors from 'cors';
import multer from "multer";
import cookieParser from "cookie-parser";
import fs from 'fs'

const app = express();
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/images", express.static(path.join(__dirname, "public/images")));


// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"))

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.set('view engine', 'ejs');

app.use(cors());

app.use("/api/uploads", files_router); // uploads to aws bucket

app.use("/api/users", users_router);
app.use("/api/posts", posts_router);
app.use("/api/facts", facts_router);
app.use("/api/topics", topics_router);
app.use("/api/conversations", conversations_router);
app.use("/api/messages", messages_router);

app.listen(process.env.PORT || 10000, () => {
    console.log(`Backend server is running on port ${process.env.PORT || 10000}`);
})
