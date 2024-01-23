import {CLEAR_ERROR, CREATE_BILL_FAIL, CREATE_BILL_REQUEST, CREATE_BILL_SUCCESS, GET_BILL_DATA_FAIL, GET_BILL_DATA_REQUEST, GET_BILL_DATA_SUCCESS} from '../Constants/billConstants'
import axios from 'axios'

export const createBill=(billData)=>async(dispatch)=>{
    try{
        console.log("loging")
        console.log(billData)
        dispatch({
            type:CREATE_BILL_REQUEST
        })
        const config={
            headers:{
                'Content-Type': 'application/json'
            }
        }

        const { data }=await axios.post(`/api/v1/submitInvoiceData`,billData,config);
        console.log(data);
        dispatch({
            type:CREATE_BILL_SUCCESS,
            payload:data.billData
        })



    }catch(error){
        console.log(error)
        dispatch({
            type:CREATE_BILL_FAIL,
            payload:error.response.data.errMessage
        })
    }
}

export const getBillData=(id)=>async(dispatch)=>{
    try{

        dispatch({
            type:GET_BILL_DATA_REQUEST
        })
      

        const { data }=await axios.get(`/api/v1/getBillData/${id}`);
        console.log(data);
        dispatch({
            type:GET_BILL_DATA_SUCCESS,
            payload:data.billData
        })



    }catch(error){
        console.log(error)
        dispatch({
            type:GET_BILL_DATA_FAIL,
            payload:error.response.data.errMessage
        })
    }
}

export const clearErrors=()=>async(dispatch)=>{
    dispatch({
        type:CLEAR_ERROR
    })
}