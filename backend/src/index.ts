import express, {Request, Response} from 'express';
import cors from 'cors';
import mongoose from 'mongoose'; 
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from 'path';
import "dotenv/config";

mongoose.connect(process.env.MONGODB_URL as string);

const app=express();
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.static(path.join(__dirname, "../../frontend/dist")))

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(8000, ()=>{  
    console.log("Server is running on localhost:8000");
});