import { getPublic } from "@/utils/publicRequest";
import { del, get, postFormData, putFormData } from "@/utils/request"

export const getRoomTypesByHotelForHotelAdmin = async (HotelId) => {
  const response = await get(`room-type/hotel-admin/hotel/${HotelId}`);
  return response.result;
}

export const getRoomTypesByHotel = async (HotelId) => {
  const response = await getPublic(`room-type/hotel/${HotelId}`);
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

export const getAvailableRoomTypes = async (hotelId, checkIn, checkOut) => {
  if (!checkIn || !checkOut) {
    return getRoomTypesByHotel(hotelId);
  }
  const params = new URLSearchParams({ checkIn, checkOut });
  const response = await getPublic(`room-type/hotel/${hotelId}/available?${params.toString()}`);
  return response.result;
};