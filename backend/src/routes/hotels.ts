import express, { Request, Response, query } from "express";
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import verifyToken from "../middleware/auth";
import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

const router = express.Router();

router.get("/search", async (req: Request, res: Response) => {
    try {
        const query = constructSearchQuery(req.query);

        let sortOptions = {};

        switch (req.query.sortOption) {
            case "starRating":
                sortOptions = { starRating: -1 };
                break;
            case "pricePerNightAsc":
                sortOptions = { pricePerNight: 1 };
                break;
            case "pricePerNightDesc":
                sortOptions = { pricePerNight: -1 };
                break;
        }

        const pageSize = 5;
        const pageNumber = parseInt(
            req.query.page ? req.query.page.toString() : "1"
        );

        const skip = (pageNumber - 1) * pageSize;
        const hotels = await Hotel.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize);

        const total = await Hotel.countDocuments(query);

        const response: HotelSearchResponse = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            },
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});

router.get(
    "/:id",
    [param("id").notEmpty().withMessage("Hotel ID is required")],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        try {
            const hotelDetail = await Hotel.findOne({
                _id: req.params.id.toString(),
            });

            return res.status(201).send(hotelDetail);
        } catch (error) {
            res.status(500).json({
                message: "Hotel Fetching Failed",
            });
        }
    }
);

router.post(
    "/:hotelId/bookings/payment-intent",
    verifyToken,
    async (req: Request, res: Response) => {
        const { numberOfNights } = req.body;
        const hotelId = req.params.hotelId;

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(400).json({
                message: "Hotel not found",
            });
        }

        const totalCost = hotel.pricePerNight * numberOfNights;

        const payemntIntent = await stripe.paymentIntents.create({
            amount: totalCost * 100,
            currency: "inr",
            metadata: {
                hotelId,
                userId: req.userId,
            },
        });
       

        if (!payemntIntent.client_secret) {
            return res.status(500).json({
                message: "Error creating payment",
            });
        }

        const response = {
            paymentIntentId: payemntIntent.id,
            clientSecret: payemntIntent.client_secret.toString(),
            totalCost,
        };

        res.status(200).send(response);
    }
);

router.post(
    "/:hotelId/bookings",
    verifyToken,
    async (req: Request, res: Response) => {
        try {
            const paymentIntentId = req.body.paymentIntentId;
            const paymentIntent = await stripe.paymentIntents.retrieve(
                paymentIntentId as string
            );

            if (!paymentIntent) {
                return res.status(400).json({
                    message: "payment intent not found",
                });
            }

            if (
                paymentIntent.metadata.hotelId !== req.params.hotelId ||
                paymentIntent.metadata.userId !== req.userId
            ) {
                return res.status(400).json({
                    message: "Payment intent mismatch",
                });
            }

            if (paymentIntent.status !== "succeeded") {
                return res.status(400).json({
                    message: `payment intent not succeed. Status ${paymentIntent.status}`,
                });
            }

            const newBooking: BookingType = {
                ...req.body,
                userId: req.userId,
            };
            
            const hotel = await Hotel.findOneAndUpdate(
                { _id: req.params.hotelId },
                {
                    $push: { bookings: newBooking },
                }
            );

            if (!hotel) {
                return res.status(400).json({
                    message: "hotel not found",
                });
            }

            await hotel.save();

            res.status(200).send({
                message: "Booking successful",
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Something went wrong",
            });
        }
    }
);

const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};

    if (queryParams.destination) {
        constructedQuery.$or = [
            { city: new RegExp(queryParams.destination, "i") },
            { country: new RegExp(queryParams.destination, "i") },
        ];
    }
    if (queryParams.adultCount) {
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount),
        };
    }
    if (queryParams.childCount) {
        constructedQuery.childCount = {
            $gte: parseInt(queryParams.childCount),
        };
    }

    if (queryParams.facilities) {
        constructedQuery.facilities = {
            $all: Array.isArray(queryParams.facilities)
                ? queryParams.facilities
                : [queryParams.facilities],
        };
    }

    if (queryParams.types) {
        constructedQuery.type = {
            $in: Array.isArray(queryParams.types)
                ? queryParams.types
                : [queryParams.types],
        };
    }

    if (queryParams.stars) {
        const starRating = Array.isArray(queryParams.stars)
            ? queryParams.stars.map((star: string) => parseInt(star))
            : [queryParams.stars];

        constructedQuery.starRating = { $in: starRating };
    }

    if (queryParams.maxPrice) {
        constructedQuery.pricePerNight = {
            $lte: parseInt(queryParams.maxPrice).toString(),
        };
    }

    return constructedQuery;
};
export default router;
