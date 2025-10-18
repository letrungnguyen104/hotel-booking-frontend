//index reducer
import { combineReducers } from 'redux';
import loginReducer from "./login"
import userReducer from './user';
import searchReducer from './search';
import checkoutReducer from './checkout';

const allReducers = combineReducers({
  loginReducer,
  userReducer,
  searchReducer,
  checkoutReducer
})

export default allReducers