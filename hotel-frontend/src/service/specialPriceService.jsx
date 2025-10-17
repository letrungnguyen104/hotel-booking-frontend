// src/service/specialPriceService.js
import { get, post, del } from '@/utils/request';

export const getSpecialPricesByRoomType = async (roomTypeId) => {
  const response = await get(`special-prices/room-type/${roomTypeId}`);
  return response.result;
};

export const createSpecialPrice = async (data) => {
  const response = await post('special-prices', data);
  return response.result;
};

export const deleteSpecialPrice = async (specialPriceId) => {
  const response = await del(`special-prices/${specialPriceId}`);
  return response.result;
};
