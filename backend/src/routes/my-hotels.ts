import express, {Request, Response} from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel, { HotelType } from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body, validationResult } from "express-validator";

const router = express.Router();

//adding multer storage to upload file to buffer memory
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

router.post("/",
     verifyToken,
     [
        body("name").notEmpty().withMessage("Name is required"),
        body("city").notEmpty().withMessage("city is required"),
        body("country").notEmpty().withMessage("country is required"),
        body("description").notEmpty().withMessage("description is required"),
        body("type").notEmpty().withMessage("type is required"),
        body("pricepernight")
        .notEmpty()
        .isNumeric()
        .withMessage("price per night is required"),
        body("facilities")
        .notEmpty()
        .isArray()
        .withMessage("facilities is required"),
     ], 
     upload.array("imageFiles", 6), 
     async (req: Request, res: Response) => { 
    // Tasks Breakdown
    // 1. Take images and other data from user
    // 2. upload image to cluodinary 
    // 3. Add all user data and images to database
    // 4. return the response

    try{
        
        const imageFiles = req.files as Express.Multer.File[];
        const newHotelFields: HotelType = req.body;

        //Cloudinary Steps
        
        // Step 1 Cloudinary -->  upload the images to cloudinary
        const uploadImagePromises = imageFiles.map(async (image) => {
            // encode image as base64 string
            const ba64 = Buffer.from(image.buffer).toString("base64");
            let dataURI = "data:" + image.mimetype + ";base64," + ba64;
            const res = await cloudinary.v2.uploader.upload(dataURI);
            return res.url;
        });

        const imageUrls = await Promise.all(uploadImagePromises);
        // Step 2 Cloudinary --> if upload success, add URLS to hotel
        newHotelFields.imageURLs = imageUrls;
        newHotelFields.lastUpdated = new Date();
        newHotelFields.userId = req.userId;

        // Step 3 Cloudinary --> save hotel in database
        const hotel = new Hotel(newHotelFields);
        await hotel.save();

        return res.status(201).send(hotel);

    } catch (errors){
        console.log(errors)
        res.status(500).json({
            message: "Something went wrong"
        })
    }

});

export default router;