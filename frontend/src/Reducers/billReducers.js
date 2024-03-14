import { CREATE_BILL_FAIL, CREATE_BILL_REQUEST, CREATE_BILL_SUCCESS ,CLEAR_ERROR, GET_BILL_DATA_REQUEST, GET_BILL_DATA_SUCCESS, GET_BILL_DATA_FAIL} from '../Constants/billConstants'


export const billDetailsReducer = (state = { billDetails: {},isError:false }, action) => {
    switch (action.type) {
        case CREATE_BILL_REQUEST:
        case GET_BILL_DATA_REQUEST:
            return {
               ...state,
                loading: true
            }

        case CREATE_BILL_SUCCESS:
        case GET_BILL_DATA_SUCCESS:
            return {
                ...state,
                billDetails: action.payload,
                loading: false
            }
        case CREATE_BILL_FAIL:
        case GET_BILL_DATA_FAIL:
            return {
                billDetails: {},
                loading: false,
                isError: true,
                error: action.payload
            }
        case CLEAR_ERROR:
            return {
                ...state,
                isError: false,
                error: null
            }
        default:
            return state

    }

}