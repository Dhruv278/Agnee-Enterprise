import {createStore,combineReducers,applyMiddleware} from 'redux';

import {thunk} from 'redux-thunk';
import {composeWithDevTools} from  'redux-devtools-extension'
import {billDetailsReducer} from './Reducers/billReducers'

const reducer=combineReducers({
    billDetails:billDetailsReducer
});


let initialState={}


const middleware=[thunk];
const store=createStore(reducer,initialState)

export default store;
