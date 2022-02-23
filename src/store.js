import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers';
import axiosMiddleware from 'redux-axios-middleware';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import axios from 'axios';

const client = axios.create({
    baseURL: '-------------',
    responseType: 'json'
});

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, compose(
    applyMiddleware(axiosMiddleware(client))
));

const persistor = persistStore(store);
export { store, persistor }
