import { getPublic } from "@/utils/publicRequest"
import { get, patch, postFormData, putFormData } from "@/utils/request";

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

export const searchHotels = async (params) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await get(`hotels/search?${queryString}`);
  return response.result;
};

export const getAllHotelsForAdmin = async () => {
  const response = await get('hotels/admin/get-alls');
  return response.result;
};

export const approveHotel = async (id) => {
  const response = await patch(`hotels/admin/approve/${id}`);
  return response.result;
};

export const rejectHotel = async (id) => {
  const response = await patch(`hotels/admin/reject/${id}`);
  return response.result;
};

export const banHotel = async (id) => {
  const response = await patch(`hotels/admin/ban/${id}`);
  return response.result;
};

export const unbanHotel = async (id) => {
  const response = await patch(`hotels/admin/unban/${id}`);
  return response.result;
};

export const closeHotel = async (id) => {
  const response = await del(`hotels/close/${id}`);
  return response.result;
}