import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';
import { InvoiceSliceStateType } from '../Slices/InvoiceSlice';
import {createBillAPI, getBillsByDateRangeByAPI} from '../Actions/InvoiceAPI'
import { InvoiceType } from '../../dto/InvoiceType.dto';


export const InvoiceReducer = (builder: ActionReducerMapBuilder<InvoiceSliceStateType>) => {
    builder.addCase(createBillAPI.pending, (state) => {
        state.loading = true;
        
    })
        .addCase(createBillAPI.fulfilled, (state, action: PayloadAction<InvoiceType>) => {
            state.loading = false;
            console.log(action.payload)
            state.currentInvoice=action.payload;
            state.isInvoiceCreated=true;
          
        })
        .addCase(createBillAPI.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.isError = true;

          
        }).addCase(getBillsByDateRangeByAPI.pending, (state) => {
            state.loading = true;
            
        })
            .addCase(getBillsByDateRangeByAPI.fulfilled, (state, action: PayloadAction<InvoiceType[]>) => {
                state.loading = false;
               state.invoices=action.payload;
              
            })
            .addCase(getBillsByDateRangeByAPI.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.isError = true;
    
              
            })

};