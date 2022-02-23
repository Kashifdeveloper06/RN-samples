import * as TYPES from '../../types';
import { Platform } from 'react-native';
// import Toast from 'react-native-toast-native';
// import * as STYLES from '../../../services/styling/globalStyles';

const initialState = {
    isLoading: false,
    isLoadingListItems:false,
    isLoadingCategories:false,
    apiResponse:false,
    apiResponseCode:0,
    responseText:'',

}
const reducer = (state = initialState, actions) => {
    switch (actions.type) {
        case TYPES.SHOW_LOADER:
            return {
                ...state,
                isLoading: true
            }
        case TYPES.HIDE_LOADER:
            return {
                ...state,
                isLoading: false
            }
        case TYPES.API_RESPONSE:
            return {
                ...state,
                apiResponse: actions.status
            }
        case TYPES.API_RESPONSE_CODE:
            return {
                ...state,
                apiResponseCode: actions.code
            }
        case TYPES.API_RESPONSE_TEXT:
            return {
                ...state,
                responseText: actions.message
            }
        case TYPES.SHOW_LIST_ITEMS_LOADER:
        return{
            ...state,
            isLoadingListItems:true
        }
        case TYPES.HIDE_LIST_ITEMS_LOADER:
        return{
            ...state,
            isLoadingListItems:false
        }
        case TYPES.SHOW_CATEGORIES_LOADER:
            return{
                ...state,
                isLoadingCategories:true
            }
        case TYPES.HIDE_CATEGORIES_LOADER:
            return{
                ...state,
                isLoadingCategories:false
            }
        default:
            return state

    }

}
export default reducer