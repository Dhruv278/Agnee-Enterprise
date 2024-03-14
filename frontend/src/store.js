import {createStore,combineReducers,applyMiddleware,compose} from 'redux';

import {thunk} from 'redux-thunk';
import {composeWithDevTools} from  'redux-devtools-extension'
import {billDetailsReducer} from './Reducers/billReducers'

const reducer=combineReducers({
    billDetails:billDetailsReducer
});


let initialState={}


const middleware=[thunk];
// Use composeWithDevTools only in development
const composeEnhancers = process.env.TYPE === 'DEVELOPMENT' ? composeWithDevTools : composeWithDevTools;

const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(...middleware)));

// const store=createStore(reducer,initialState,applyMiddleware(...middleware) )

export default store;
