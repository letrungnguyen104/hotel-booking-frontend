import { del, get, postFormData, putFormData } from "@/utils/request"

export const getRoomTypesByHotel = async (HotelId) => {
  const response = await get(`room-type/hotel/${HotelId}`);
  return response.result;
}

export const createRoomType = async (formData) => {
  const response = await postFormData(`room-type`, formData);
  return response.result;
}

export const updateRoomType = async (editingTypeId, formData) => {
  const response = await putFormData(`room-type/${editingTypeId}`, formData);
  return response.result;
}

export const deleteRoomType = async (roomTypeId) => {
  const response = await del(`room-type/${roomTypeId}`);
  return response.result;
}