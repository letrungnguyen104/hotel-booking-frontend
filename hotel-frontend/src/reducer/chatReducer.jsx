import { ChatActionTypes } from "@/action/chatActions";

const initialState = {
  conversations: [],
  messages: [],
  onlineUsers: new Set(),
  activeChatPartnerId: null,
  isSocketConnected: false,
  recipientId: null,
  recipientName: null,
  hotelId: null,
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case ChatActionTypes.SET_CONVERSATIONS:
      return {
        ...state,
        conversations: action.payload,
      };

    case ChatActionTypes.SET_MESSAGES:
      return {
        ...state,
        messages: action.payload,
      };

    case ChatActionTypes.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };

    case ChatActionTypes.SET_ONLINE_USERS:
      return {
        ...state,
        onlineUsers: action.payload
      };

    case ChatActionTypes.SET_CONVO_UNREAD:
      return {
        ...state,
        conversations: state.conversations.map(c =>
          c.conversationPartnerId === action.payload ? { ...c, unreadCount: 0 } : c
        )
      };

    case ChatActionTypes.SET_ACTIVE_CHAT_PARTNER:
      return {
        ...state,
        activeChatPartnerId: action.payload
      };

    case ChatActionTypes.UPDATE_CONVO_LIST: {
      const { message, currentUserId } = action.payload;

      const partnerId = message.senderId === currentUserId
        ? message.receiverId
        : message.senderId;
      const isMe = message.senderId === currentUserId;

      const convoToUpdate = state.conversations.find(c => c.conversationPartnerId === partnerId);
      let updatedConvos = state.conversations.filter(c => c.conversationPartnerId !== partnerId);

      const partnerName = isMe ? (message.receiverFullName || message.receiverUsername) : (message.senderFullName || message.senderUsername);
      const partnerUsername = isMe ? message.receiverUsername : message.senderUsername;

      const newConvoData = {
        ...(convoToUpdate || {}),
        conversationPartnerId: partnerId,
        conversationPartnerName: partnerName,
        conversationPartnerUsername: partnerUsername,
        conversationPartnerAvatar: convoToUpdate?.conversationPartnerAvatar || null,
        lastMessage: isMe ? `Bạn: ${message.message}` : message.message,
        timestamp: message.sentAt,
        unreadCount: (state.activeChatPartnerId === partnerId || isMe)
          ? 0
          : (convoToUpdate?.unreadCount || 0) + 1,
        hotelId: message.hotelId
      };


      return {
        ...state,
        conversations: [newConvoData, ...updatedConvos]
      };
    }

    case 'START_CHAT_WITH':
      return {
        ...state,
        recipientId: action.payload.recipientId,
        recipientName: action.payload.recipientName,
        hotelId: action.payload.hotelId,
      };

    case 'CLEAR_CHAT_RECIPIENT':
      return {
        ...state,
        recipientId: null,
        recipientName: null,
        hotelId: null,
      };

    case ChatActionTypes.SET_SOCKET_CONNECTED:
      return {
        ...state,
        isSocketConnected: action.payload,
      };

    default:
      return state;
  }
};

export default chatReducer;