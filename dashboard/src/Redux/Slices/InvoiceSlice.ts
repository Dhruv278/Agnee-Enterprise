import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { InvoiceType } from '../../dto/InvoiceType.dto'
import { InvoiceReducer } from '../Reducers/InvoiceReducer'
 
export interface InvoiceSliceStateType{
    loading:boolean,
    invoices:InvoiceType[],
    isError:boolean,
    currentInvoice?:InvoiceType,
    isInvoiceUpdated:boolean,
    isInvoiceCreated:boolean,

}

const initialState:InvoiceSliceStateType = {
   loading:false,
   isInvoiceUpdated:true,
   isError:false,
   invoices:[],
   isInvoiceCreated:false,
}

const InvoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {
        clearInvoiceCreatedFlag(state){
      
      state.isInvoiceCreated=false;
       },
       setCurrentInvoice(state,action:PayloadAction<InvoiceType>){
        state.currentInvoice=action.payload;
       }
    },
    extraReducers: (builder) => {
        InvoiceReducer(builder);
    },
})

export const {
    clearInvoiceCreatedFlag,
    setCurrentInvoice
} = InvoiceSlice.actions

export default InvoiceSlice.reducer
