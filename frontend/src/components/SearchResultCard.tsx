import { AiFillStar } from "react-icons/ai"
import { HotelType } from "../../../backend/src/shared/types"
import { Link } from "react-router-dom"

type Props = {
    hotel: HotelType
}


const SearchResultCard = ({hotel}: Props) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-gray-200 shadow-sm rounded-lg p-8 gap-8">
        <div className="w-full h-[300px]">
            <img src={hotel.imageURLs[0]} className="w-full h-full object-cover object-center" />
        </div>
        <div className="grid grid-rows-[1fr_2fr_1fr]">
            <div>
                <div className="flex items-center">
                    <span className="flex">
                        {Array
                            .from({length: hotel.starRating})
                            .map(() => (
                                <AiFillStar className="fill-yellow-400" />
                            ))
                        }
                    </span>
                    <span className="ml-1 text-sm font-bold">{hotel.type}</span>
                </div>
                <Link to={`/details/${hotel._id}`}>
                    <h2 className="text-2xl font-bold cursor-pointer mt-2">
                        {hotel.name}
                    </h2>
                </Link>
            </div>

            <div>
                <div className="line-clamp-4">
                    {hotel.description}
                </div>
            </div>

            <div className="grid grid-cols-2 items-end whitespace-nowrap">
                <div className="flex gap-1 items-center">
                    {hotel.facilities.slice(0,3).map((facility)=>(
                        <span className="bg-slate-300 p-2 rounded-lg font-bold text-xs whitespace-nowrap">
                            {facility}
                        </span>
                    ))}
                    <span className="text-sm">{hotel.facilities.length>3 && `+${hotel.facilities.length-3} more`}</span>
                </div>

                <div className="flex flex-col items-end gap-1">
                    <span className="font-bold text-sm">₹{hotel.pricePerNight} Per Night</span>
                    <Link to={`/detail/${hotel._id}`} className="bg-blue-600 text-white h-full p-2 text-x max-w-fit">
                        View More
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SearchResultCard;