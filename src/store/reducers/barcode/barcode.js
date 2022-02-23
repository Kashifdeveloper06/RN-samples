import * as TYPES from '../../types';
const initialState = {
    barcodeProductDetails: null,
}
const reducer = (state = initialState, actions) => {
    switch (actions.type) {
        case TYPES.BARCODE_PRODUCT_DETAILS:
            return {
                ...state,
                barcodeProductDetails: actions.barcodeProductDetails
            }
        case TYPES.RESET_BARCODE_PRODUCT_DETAILS:
        return {
            ...state,
            barcodeProductDetails: null
        }
        default:
            return state

    }

}
export default reducer