// src/service/hotelAdminService.js
import { del, get, post, put } from '@/utils/request';

export const getMyBusinessProfile = async () => {
  const response = await get('hotel-admin/my-profile');
  return response.result;
};

export const updateMyBusinessProfile = async (profileId, data) => {
  const response = await put(`hotel-admin/${profileId}`, data);
  return response.result;
};

export const createMyBusinessProfile = async (data) => {
  const response = await post('hotel-admin', data);
  return response.result;
}

export const checkMyBusinessProfileStatus = async () => {
  const response = await get('hotel-admin/my-status');
  return response.result;
};

export const getAllBusinessProfiles = async () => {
  const response = await get('hotel-admin/get-all');
  return response.result;
};

export const verifyBusinessProfile = async (profileId) => {
  const response = await put(`hotel-admin/${profileId}/verify`);
  return response.result;
};

export const deleteBusinessProfile = async (profileId) => {
  await del(`hotel-admin/${profileId}`);
};