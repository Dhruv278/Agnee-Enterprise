import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { getHostUrl } from "./getHostURL";

export const createBillAPI = createAsyncThunk(
    'invoice/createBillAPI',
    async (data:any, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${getHostUrl()}/api/v1/submitInvoiceData`,data);
            console.log(response.data);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response);
        }
    }
);
export const getBillsByDateRangeByAPI = createAsyncThunk(
    'invoice/getBillsByDateRangeByAPI',
    async (data:{startDate:string,endDate:string}, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${getHostUrl()}/api/v1/getFilterBillData`,{options:data});
            console.log(response.data);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response);
        }
    }
);


export const generateExcelReport = createAsyncThunk(
    'invoice/generateExcelReport',
    async (data:{month:number,year:number}, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${getHostUrl()}/api/v1/getBillByMonth?month=${data.month}&year=${data.year}`,{});
            console.log(response.data);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response);
        }
    }
);

