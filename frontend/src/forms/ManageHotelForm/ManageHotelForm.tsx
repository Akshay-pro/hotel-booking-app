import { FormProvider, useForm } from "react-hook-form";
import DetailSection from "./DetailSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestSection from "./GuestSection";
import ImagesSection from "./ImagesSection";
import { useEffect } from "react";

export type HotelType = {
  _id:string;
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
  imageFiles:string[];
  imageURLs: string[];
} 

type Props = {
  hotel?: HotelType;
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
}

const ManageHotelForm = ({onSave, isLoading, hotel}: Props) => {

  const formMethods = useForm<HotelType>();
  const {handleSubmit, reset} = formMethods;

  useEffect(() => {
    reset(hotel);
  }, [hotel, reset]);


  const onSubmit = handleSubmit((formDataJson: HotelType) => {
      const formData = new FormData();
      if (hotel) {
        formData.append("hotelId", hotel._id);
      } 
      formData.append("name", formDataJson.name);
      formData.append("city", formDataJson.city);
      formData.append("country", formDataJson.country);
      formData.append("description", formDataJson.description);
      formData.append("type", formDataJson.type);
      formData.append("pricePerNight", formDataJson.pricePerNight.toString());
      formData.append("starRating", formDataJson.starRating.toString());
      formData.append("adultCount", formDataJson.adultCount.toString());
      formData.append("childCount", formDataJson.childCount.toString());

      formDataJson.facilities.forEach((facility, index) => {
        formData.append(`facilities[${index}]`, facility);
      }); 

      if(formDataJson.imageURLs){
        formDataJson.imageURLs.forEach((url, index) => {
          formData.append(`imageURLs[${index}]`,url);
        })
      }
      
      Array.from(formDataJson.imageFiles).forEach((imageFile) => {
        formData.append(`imageFiles`, imageFile);
      });

      onSave(formData);
  })

  return (
    <FormProvider {...formMethods}>
      <form className="flex flex-col gap-10" onSubmit={onSubmit} encType="multipart/form-data">
          <DetailSection />
          <TypeSection />
          <FacilitiesSection />
          <GuestSection />
          <ImagesSection />

          <span className="flex justify-end">
            <button type="submit" disabled={isLoading} className="bg-blue-600 text-white font-bold hover:bg-blue-500 text-l px-10 py-3 rounded disabled:bg-gray-500">
              {isLoading? "Pending": "Submit"}  
            </button>
          </span>
      </form>
    </FormProvider>
  )
}

export default ManageHotelForm