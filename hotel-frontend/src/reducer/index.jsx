//index reducer
import { combineReducers } from 'redux';
import loginReducer from "./login"
import userReducer from './user';

const allReducers = combineReducers({
  loginReducer,
  userReducer
})

export default allReducers