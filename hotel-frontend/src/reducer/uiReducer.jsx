const initialState = {
  isLoginModalOpen: false,
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'OPEN_LOGIN_MODAL':
      return {
        ...state,
        isLoginModalOpen: true,
      };
    case 'CLOSE_LOGIN_MODAL':
      return {
        ...state,
        isLoginModalOpen: false,
      };
    default:
      return state;
  }
};

export default uiReducer;