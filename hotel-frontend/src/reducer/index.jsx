//index reducer
import { combineReducers } from 'redux';
import loginReducer from "./login"
import userReducer from './user';
import searchReducer from './search';

const allReducers = combineReducers({
  loginReducer,
  userReducer,
  searchReducer
})

export default allReducers