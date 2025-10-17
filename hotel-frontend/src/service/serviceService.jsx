// src/service/serviceService.js
import { get, post, put, del } from '@/utils/request';

export const getServicesByHotel = async (hotelId) => {
  const response = await get(`services/hotel/${hotelId}`);
  return response.result;
};

export const getServicesByHotelForHotelAdmin = async (hotelId) => {
  const response = await get(`services/hotel-admin/hotel/${hotelId}`);
  return response.result;
};

export const createService = async (data) => {
  const response = await post('services', data);
  return response.result;
};

export const updateService = async (serviceId, data) => {
  const response = await put(`services/${serviceId}`, data);
  return response.result;
};

export const deleteService = async (serviceId) => {
  const response = await del(`services/${serviceId}`);
  return response.result;
};