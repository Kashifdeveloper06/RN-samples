import * as TASKS from '../index';
import * as utilities from '../../../utilities';
import * as TYPES from '../../types';



const removeContent = () => {
    return {
        type: TYPES.RESET_BARCODE_PRODUCT_DETAILS,
    };
};
export const barcodeProductDetails = (params) => {
    console.log('params', params)
    return dispatch => {
        dispatch(TASKS.showLoader());
        //fetch(`${utilities.BASE_URL}promotions/detail?id= ${params.promo_id}`, {
        fetch(`${utilities.BASE_URL}productsAndPromotionsByBarcode?barcode=${params.barcode}&country_code=${params.country_code}`, {
            // method: 'GET',
            headers: utilities.Interceptor.getHeaders(),
            // body: JSON.stringify(params),
        }).then((response) => response.json()) 
            .then((result) => {
                console.log('result', result)
                dispatch(TASKS.hideLoader());
                if (result.status == true) {
                    // dispatch(storeUser(result.data));
                        dispatch({
                            type: TYPES.BARCODE_PRODUCT_DETAILS,
                            barcodeProductDetails: result.data
                        })
                } else {
                    if (result.code === 419) {
                        utilities.backendErrorMessage('product not found', "Please enable location to search products in your country.");
                    }else{
                        utilities.backendErrorMessage('wrong barcode', "Wrong Barcode! Please Scan Again");
                    }
                    
                }
            }).catch((error) => {
                dispatch(TASKS.hideLoader());
                utilities.backendErrorMessage(error, "Something went wrong. Please try again");
                
            })
  
    }
}
export const resetBarcodeItemDetails = params => {
    return dispatch => {
        dispatch(removeContent());
    }
}