import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
//import commence from './reducers/Auth/Auth';
import promotions from "./reducers/promotions/promotions";
import barcode from "./reducers/barcode/barcode";
import UI from "./reducers/ui/ui";
import Lists from "./reducers/lists/lists";
import login from "./reducers/login/login";
import Shop from "./reducers/shop/shop";

const rootReducer = combineReducers({
  //auth: commence,
  ui: UI,
  promotions: promotions,
  barcode: barcode,
  Lists: Lists,
  login: login,
  shop: Shop,
  // pat: PAT
});

const persistConfig = {
  timeout: 10000,
  key: "root",
  storage,
  blacklist: ["ui"],
};

const middleware = applyMiddleware(thunk);

let composeEnhancers = compose;

if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const STORE = createStore(
  persistedReducer,
  composeEnhancers(middleware)
);
export const PERSISTOR = persistStore(STORE);
