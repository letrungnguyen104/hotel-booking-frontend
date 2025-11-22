export const ChatActionTypes = {
  SET_CONVERSATIONS: 'SET_CONVERSATIONS',
  SET_MESSAGES: 'SET_MESSAGES',
  ADD_MESSAGE: 'ADD_MESSAGE',
  UPDATE_CONVO_LIST: 'UPDATE_CONVO_LIST',
  SET_ONLINE_USERS: 'SET_ONLINE_USERS',
  SET_CONVO_UNREAD: 'SET_CONVO_UNREAD',
  SET_ACTIVE_CHAT_PARTNER: 'SET_ACTIVE_CHAT_PARTNER',
  SET_SOCKET_CONNECTED: 'SET_SOCKET_CONNECTED',
  START_CHAT_WITH: 'START_CHAT_WITH',
  CLEAR_CHAT_RECIPIENT: 'CLEAR_CHAT_RECIPIENT',
};

export const setConversations = (conversations) => ({
  type: ChatActionTypes.SET_CONVERSATIONS,
  payload: conversations,
});

export const setMessages = (messages) => ({
  type: ChatActionTypes.SET_MESSAGES,
  payload: messages,
});

export const handleNewChatMessage = (message, currentUserId) => ({
  type: ChatActionTypes.UPDATE_CONVO_LIST,
  payload: { message, currentUserId },
});

export const addMessageToHistory = (message) => ({
  type: ChatActionTypes.ADD_MESSAGE,
  payload: message,
});

export const setOnlineUsers = (usersSet) => ({
  type: ChatActionTypes.SET_ONLINE_USERS,
  payload: usersSet,
});

export const setConversationUnread = (partnerId) => ({
  type: ChatActionTypes.SET_CONVO_UNREAD,
  payload: partnerId,
});

export const setActiveChatPartner = (partnerId) => ({
  type: ChatActionTypes.SET_ACTIVE_CHAT_PARTNER,
  payload: partnerId,
});

export const setSocketConnected = (isConnected) => ({
  type: ChatActionTypes.SET_SOCKET_CONNECTED,
  payload: isConnected,
});