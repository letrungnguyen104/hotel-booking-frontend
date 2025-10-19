// src/service/notificationService.js
import { get, patch, post } from '@/utils/request';

export const getMyNotifications = async () => {
  const response = await get('notifications/my-notifications');
  return response.result;
};

export const sendNotification = async (data) => {
  const response = await post('notifications/admin/send', data);
  return response.result;
};

export const markAsRead = async (id) => {
  const response = await patch(`notifications/read/${id}`);
  return response.result;
};

export const markAllAsRead = async () => {
  const response = await patch('notifications/read-all');
  return response.result;
};