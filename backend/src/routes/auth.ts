import express, {Request, Response} from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.post("/login", [
        check("email", "Email is required").isEmail(),
        check("password", "Password with 6 or more character is required").isLength({min:6})
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.sendStatus(400).json({
                message:errors.array()
            });
        }

        const {email, password} = req.body;
        
        try{
            const user = await User.findOne({email});
           
            if(!user){
                return res.status(400).json({
                    message: "Invalid credentials",
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            
            if(!isMatch){
                return res.status(400).json({
                    message: "Invalid credentials",
                });
            }

            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET_KEY as string,
                {
                    expiresIn:"1d",
                }
            );

            const options = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 86400000,
            }
            res.cookie("auth_token", token, options);

            return res.status(200).json({
                userId: user._id
            });

        } catch(errors){
            console.log(errors);
            return res.status(500).json({
                message: "Something went wrong"
            });
        }
    }
);


router.get("/validate-token", verifyToken, async (req: Request, res:Response) => {
    res.status(200).send({
        userId: req.userId
    })
})


router.post("/logout", async (req: Request, res: Response) => {
    const options = {
        expires: new Date(0),
    }
    res.cookie("auth_token", "", options);

    res.status(200).send({
        message: "Logout Success"
    });
})
export default router;