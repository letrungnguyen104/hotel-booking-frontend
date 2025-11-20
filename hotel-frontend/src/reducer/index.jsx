//reducer/index
import { combineReducers } from 'redux';
import loginReducer from "./login"
import userReducer from './user';
import searchReducer from './search';
import checkoutReducer from './checkout';
import adminChatReducer from './adminChatReducer';
import uiReducer from './uiReducer';
import notificationReducer from './notificationReducer';
import chatReducer from './chatReducer';

const allReducers = combineReducers({
  loginReducer,
  userReducer,
  searchReducer,
  checkoutReducer,
  chatReducer,
  adminChatReducer,
  uiReducer,
  notificationReducer,
})

export default allReducers