import { combineReducers } from 'redux';
import * as asyncInitialState from 'redux-async-initial-state';


export default asyncInitialState.outerReducer(
    combineReducers({
        asyncInitialState: asyncInitialState.innerReducer
    })
);
