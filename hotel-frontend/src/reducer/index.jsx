//index reducer
import { combineReducers } from 'redux';
import loginReducer from "./login"
import userReducer from './user';
import searchReducer from './search';
import checkoutReducer from './checkout';
import chatReducer from './chat';
import adminChatReducer from './adminChatReducer';

const allReducers = combineReducers({
  loginReducer,
  userReducer,
  searchReducer,
  checkoutReducer,
  chatReducer,
  adminChatReducer
})

export default allReducers