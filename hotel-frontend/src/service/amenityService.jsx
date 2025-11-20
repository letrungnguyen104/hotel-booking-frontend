import { del, get, post, put } from "@/utils/request";
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

export const updateAmenity = async (id, request) => {
  try {
    const response = await put(`amenity/${id}`, request);
    return response.result;
  } catch (error) {
    console.error("Failed to update amenity", error);
    toast.error(error.response?.data?.message || "Failed to update amenity");
    throw error;
  }
};

export const deleteAmenity = async (id) => {
  try {
    const response = await del(`amenity/${id}`);
    return response;
  } catch (error) {
    console.error("Failed to delete amenity", error);
    throw error;
  }
};