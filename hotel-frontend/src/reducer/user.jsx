// src/reducers/user.js
const storedUser = localStorage.getItem("userDetails");

const initialState = storedUser ? JSON.parse(storedUser) : null;

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      localStorage.setItem("userDetails", JSON.stringify(action.payload));
      return action.payload;
    case "CLEAR_USER":
      localStorage.removeItem("userDetails");
      return null;
    default:
      return state;
  }
};

export default userReducer;