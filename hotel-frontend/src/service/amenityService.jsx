import { get } from "@/utils/request";

export const getAmenities = async () => {
  try {
    const res = await get("amenity");
    return res.result || [];
  } catch (error) {
    console.error("Failed to fetch amenities:", error);
    throw error;
  }
};