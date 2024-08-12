import { configureStore } from '@reduxjs/toolkit';

import InvoiceSlice from './Slices/InvoiceSlice';
const store = configureStore({
    reducer: {
    invoice:InvoiceSlice
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
