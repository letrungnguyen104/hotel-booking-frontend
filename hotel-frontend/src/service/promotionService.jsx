// src/service/promotionService.js
import { get, del, postFormData, putFormData, post } from '@/utils/request';

export const getAllPromotionsForAdmin = async () => {
  const response = await get('promotions/admin/all');
  return response.result;
};

export const createPromotion = async (formData) => {
  const response = await postFormData('promotions/admin', formData);
  return response.result;
};

export const updatePromotion = async (id, formData) => {
  const response = await putFormData(`promotions/admin/${id}`, formData);
  return response.result;
};

export const deletePromotion = async (id) => {
  const response = await del(`promotions/admin/${id}`);
  return response.result;
};

export const getActivePromotions = async () => {
  const response = await get('promotions');
  return response.result;
}

export const getFeaturedPromotions = async () => {
  const response = await get('promotions/featured');
  return response.result;
}

export const validatePromotion = async (code, basePrice) => {
  const response = await post('promotions/validate', { code, basePrice });
  return response.result;
}