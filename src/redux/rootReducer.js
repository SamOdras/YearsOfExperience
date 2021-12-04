import { combineReducers } from 'redux';
import storage from "redux-persist/lib/storage"; 
import { persistReducer } from "redux-persist";

import FormMainPage from '../pages/main-page/main-page.reducer';

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["Main"]
};

const appReducer = combineReducers({
  Main: FormMainPage,
})

export default persistReducer(persistConfig, appReducer)  