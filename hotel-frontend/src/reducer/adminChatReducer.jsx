// src/reducers/adminChatReducer.js
const initialState = {
  recipientId: null,
  recipientName: null,
};

const adminChatReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADMIN_START_CHAT_WITH':
      return {
        recipientId: action.payload.recipientId,
        recipientName: action.payload.recipientName,
      };
    case 'ADMIN_CLEAR_CHAT_RECIPIENT':
      return initialState;
    default:
      return state;
  }
};

export default adminChatReducer;