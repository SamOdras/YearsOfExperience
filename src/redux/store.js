import { createStore, compose } from 'redux';
import rootReducer from './rootReducer';
import { persistStore } from "redux-persist"

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(rootReducer, composeEnhancers());
export const persistor = persistStore(store);

