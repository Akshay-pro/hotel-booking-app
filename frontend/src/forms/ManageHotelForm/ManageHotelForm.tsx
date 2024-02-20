import { FormProvider, useForm } from "react-hook-form";
import DetailSection from "./DetailSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestSection from "./GuestSection";
import ImagesSection from "./ImagesSection";

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
} 

type Props = {
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
}

const ManageHotelForm = ({onSave, isLoading}: Props) => {

  const formMethods = useForm<HotelType>();
  const {handleSubmit} = formMethods;

  const onSubmit = handleSubmit((formDataJson: HotelType) => {
      const formData = new FormData();
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