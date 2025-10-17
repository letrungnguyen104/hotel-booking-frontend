import { get, postFormData, putFormData, del, post, put } from "@/utils/request";

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

export const createRoom = async (data) => {
  const response = await post('room', data);
  return response.result;
};

export const updateRoom = async (roomId, data) => {
  const response = await put(`room/${roomId}`, data);
  return response.result;
};

export const deleteRoom = async (roomId) => {
  const response = await del(`room/${roomId}`);
  return response.result;
};