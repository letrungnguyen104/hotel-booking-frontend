// src/service/chatService.js
import { get } from '@/utils/request';

export const getConversations = async () => {
  const response = await get('chat/conversations');
  return response.result;
};

export const getChatHistory = async (recipientId) => {
  const response = await get(`chat/history/${recipientId}`);
  return response.result;
};

export const getOnlineUsers = async () => {
  const response = await get('presence/online-users');
  return response;
};