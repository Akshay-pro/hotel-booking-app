export type HotelType = {
    _id: string;
    userId: string;
    name: string;
    city: string;
    country: string;
    description: string;
    type:string;
    adultCount: number;
    childCount: number;
    facilities: string[],
    pricePerNight: number;
    starRating: number;
    imageURLs: string[];
    imageFiles:string[];
    lastUpdated: Date;
} 

export type HotelSearchResponse = {
    data: HotelType[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    }
}