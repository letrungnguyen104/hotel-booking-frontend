import { getPublic } from "@/utils/publicRequest"
import { get } from "@/utils/request";

export const topFiveHotel = async (city) => {
  const response = await getPublic(`hotels/top-hotels?city=${city}`);
  return response.result;
}

export const getHotelsByOwner = async (ownerId) => {
  const res = await get(`hotels/owner/${ownerId}`);
  return res.result;
};