// src/service/chatService.js
import { get } from '@/utils/request';

export const getConversations = async () => {
  const response = await get('chat/conversations');
  return response.result;
};

export const getChatHistory = async (recipientId, hotelId) => {
  let url = `chat/history/${recipientId}`;
  if (hotelId) {
    url += `?hotelId=${hotelId}`;
  }
  const response = await get(url);
  return response.result;
};

export const getOnlineUsers = async () => {
  const response = await get('presence/online-users');
  return response.result;
};

export const getAdminConversations = async () => {
  const response = await get('users/admin/chat-list');
  return response.result;
};