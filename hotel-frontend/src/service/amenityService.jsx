import { get, post } from "@/utils/request";
import { toast } from "sonner";

export const getAmenities = async () => {
  try {
    const res = await get("amenity");
    return res.result || [];
  } catch (error) {
    console.error("Failed to fetch amenities:", error);
    throw error;
  }
};

export const createAmenity = async (request) => {
  try {
    const response = await post("amenity", request);
    console.log(response);

    return response.result;

  } catch (error) {
    console.error("Failed to create amenity", error);
    toast.error(error.response?.data?.message || "Failed to create amenity");
    return null;
  }
};