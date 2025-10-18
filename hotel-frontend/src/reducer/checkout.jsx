// src/reducer/checkout.js

const initialState = {
  cart: [],
  hotel: null,
  checkIn: null,
  checkOut: null,
};

// Hàm khởi tạo state từ localStorage
const getInitialState = () => {
  const savedCheckout = localStorage.getItem('checkoutData');
  return savedCheckout ? JSON.parse(savedCheckout) : initialState;
};

const checkoutReducer = (state = getInitialState(), action) => {
  let newState;
  switch (action.type) {
    case 'SET_CHECKOUT_DATA':
      newState = action.payload;
      break;

    case 'ADD_TO_CART':
      newState = {
        ...state,
        cart: [...state.cart, action.payload.item],
        hotel: action.payload.hotel,
        checkIn: action.payload.checkIn,
        checkOut: action.payload.checkOut,
      };
      break;

    case 'REMOVE_FROM_CART':
      const newCart = state.cart.filter((_, index) => index !== action.payload.index);
      newState = {
        ...state,
        cart: newCart,
        hotel: newCart.length > 0 ? state.hotel : null,
        checkIn: newCart.length > 0 ? state.checkIn : null,
        checkOut: newCart.length > 0 ? state.checkOut : null,
      };
      break;

    case 'CLEAR_CHECKOUT_DATA':
      newState = initialState;
      break;

    default:
      return state;
  }

  localStorage.setItem('checkoutData', JSON.stringify(newState));
  return newState;
};

export default checkoutReducer;