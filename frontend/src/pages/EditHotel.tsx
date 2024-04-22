import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";

const EditHotel = () => {
    const { hotelId } = useParams();
    const { showToast } = useAppContext();
    const navigate = useNavigate();
    const { data: hotel } = useQuery(
        "fetchHotelById",
        () => apiClient.fetchHotelById(hotelId || ""),
        {
            enabled: !!hotelId,
        }
    );

    const { mutate, isLoading } = useMutation(apiClient.updateHotelById, {
        onSuccess: () => {
            showToast({
                message: "Hotel Updated",
                type: "SUCCESS",
            });
            navigate("/");
        },
        onError: () => {
            showToast({
                message: "Error updating hotel",
                type: "ERROR",
            });
        },
    });

    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData);
    };
    return (
        <>
            <ManageHotelForm
                onSave={handleSave}
                hotel={hotel}
                isLoading={isLoading}
            />
        </>
    );
};

export default EditHotel;
