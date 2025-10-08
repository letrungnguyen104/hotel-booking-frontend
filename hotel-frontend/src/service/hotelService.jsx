import { getPublic } from "@/utils/publicRequest"
import { get, postFormData, putFormData } from "@/utils/request";

export const topFiveHotel = async (city) => {
  const response = await getPublic(`hotels/top-hotels?city=${city}`);
  return response.result;
}

export const getHotelById = async (id) => {
  const response = await get(`hotels/get-by-id/${id}`);
  return response.result;
}

export const getHotelsByOwner = async (ownerId, status) => {
  const url = status
    ? `hotels/owner/${ownerId}?status=${status}`
    : `hotels/owner/${ownerId}`;
  const response = await get(url);
  return response.result;
};

export const createHotel = async (formData) => {
  const response = await postFormData("hotels", formData);
  return response.result;
};

export const updateHotel = async (id, formData) => {
  const response = await putFormData(`hotels/update/${id}`, formData);
  return response.result;
};