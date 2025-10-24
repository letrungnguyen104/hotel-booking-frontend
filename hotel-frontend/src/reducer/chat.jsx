// src/reducer/chat.js
const initialState = {
  recipientId: null,
  recipientName: null,
  hotelId: null,
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'START_CHAT_WITH':
      return {
        recipientId: action.payload.recipientId,
        recipientName: action.payload.recipientName,
        hotelId: action.payload.hotelId,
      };
    case 'CLEAR_CHAT_RECIPIENT':
      return initialState;
    default:
      return state;
  }
};

export default chatReducer;