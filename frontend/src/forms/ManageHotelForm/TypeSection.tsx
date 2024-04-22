import { useFormContext } from "react-hook-form";
import { HotelType } from "./ManageHotelForm";

export const hotelTypes = ["Budget", "Luxury", "Family", "Business", "Cabin"];

const TypeSection = () => {
    const {
        register,
        watch,
        formState: { errors },
    } = useFormContext<HotelType>();
    const typeWatch = watch("type");

    return (
        <div>
            <h2 className="text-2xl font-bold mb-3">Type</h2>
            <div className="grid grid-cols-5 gap-2">
                {hotelTypes.map((type) => (
                    <label
                        className={
                            typeWatch === type
                                ? "cursor-pointer bg-blue-300 text-sm rounded-full px-3 py-3 font-semibold text-center"
                                : "cursor-pointer bg-gray-300 text-sm rounded-full px-3 py-3 font-semibold text-center"
                        }
                    >
                        <input
                            type="radio"
                            value={type}
                            {...register("type", {
                                required: "This field is required",
                            })}
                            className="hidden"
                        />

                        <span>{type}</span>
                    </label>
                ))}
            </div>
            {errors.type && (
                <span className="text-red-500 text-sm font-bold">
                    {errors.type.message}
                </span>
            )}
        </div>
    );
};

export default TypeSection;
