import { get, postFormData, putFormData, del } from "@/utils/request";

export const getRoomsByRoomType = async (roomTypeId) => {
  const response = await get(`room/room-type/${roomTypeId}`);
  return response.result;
};

export const getRoomsByHotel = async (hotelId) => {
  const response = await get(`room/hotel/${hotelId}/rooms`);
  return response.result;
};

export const getRoomTypesByHotel = async (hotelId) => {
  const response = await get(`room-type/hotel/${hotelId}`);
  return response.result;
};

export const createRoom = async (formData) => {
  const response = await postFormData(`room`, formData);
  return response.result;
};

export const updateRoom = async (roomId, formData) => {
  const response = await putFormData(`room/${roomId}`, formData);
  return response.result;
};

export const deleteRoom = async (roomId) => {
  const response = await del(`room/${roomId}`);
  return response.result;
};