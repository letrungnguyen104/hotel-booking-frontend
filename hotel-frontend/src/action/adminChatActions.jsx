export const AdminChatActionTypes = {
  ADMIN_SET_CONVERSATIONS: 'ADMIN_SET_CONVERSATIONS',
  ADMIN_SET_MESSAGES: 'ADMIN_SET_MESSAGES',
  ADMIN_ADD_MESSAGE: 'ADMIN_ADD_MESSAGE',
  ADMIN_UPDATE_CONVO_LIST: 'ADMIN_UPDATE_CONVO_LIST',
  ADMIN_SET_ONLINE_USERS: 'ADMIN_SET_ONLINE_USERS',
  ADMIN_SET_CONVO_UNREAD: 'ADMIN_SET_CONVO_UNREAD',
  ADMIN_SET_ACTIVE_CHAT_PARTNER: 'ADMIN_SET_ACTIVE_CHAT_PARTNER',
  ADMIN_SET_SOCKET_CONNECTED: 'SET_SOCKET_CONNECTED',
};

export const setAdminConversations = (conversations) => ({
  type: AdminChatActionTypes.ADMIN_SET_CONVERSATIONS,
  payload: conversations,
});

export const setAdminMessages = (messages) => ({
  type: AdminChatActionTypes.ADMIN_SET_MESSAGES,
  payload: messages,
});

export const handleNewAdminChatMessage = (message, currentUserId) => ({
  type: AdminChatActionTypes.ADMIN_UPDATE_CONVO_LIST,
  payload: { message, currentUserId },
});

export const addAdminMessageToHistory = (message) => ({
  type: AdminChatActionTypes.ADMIN_ADD_MESSAGE,
  payload: message,
});

export const setAdminOnlineUsers = (usersSet) => ({
  type: AdminChatActionTypes.ADMIN_SET_ONLINE_USERS,
  payload: usersSet,
});

export const setAdminConversationUnread = (partnerId) => ({
  type: AdminChatActionTypes.ADMIN_SET_CONVO_UNREAD,
  payload: partnerId,
});

export const setAdminActiveChatPartner = (partnerId) => ({
  type: AdminChatActionTypes.ADMIN_SET_ACTIVE_CHAT_PARTNER,
  payload: partnerId,
});

export const setAdminSocketConnected = (isConnected) => ({
  type: AdminChatActionTypes.ADMIN_SET_SOCKET_CONNECTED,
  payload: isConnected,
});