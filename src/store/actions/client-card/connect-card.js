import * as TASKS from '../index';
// import * as Util from '../../../services/index';
import * as utilities from '../../../utilities';
 import * as TYPES from '../../types';
 let SOCIAL_TOKEN='';
// import * as CONSTANTS from '../../../services/constants/constants';

const updateUser = (user) => {
    return {
        type: TYPES.UPDATE_USER_POINTS,
        user: user
    };
};

const storeRedeemInfo = (redeemInfo) => {
    return {
        type: TYPES.STORE_REDEEM_INFO,
        redeemInfo: redeemInfo
    }
}

export const setIsConnectCardRequest = status => {
    return {
        type: TYPES.IS_CONNECT_CARD_REQUEST,
        isConnectCardRequest:status

    }
}

export const redeemInfo = params => {
    
    return dispatch => {
        dispatch(TASKS.showLoader());
        let url = utilities.BASE_URL+'redemptionInfo?country='+params
        fetch(`${url}`,{
            method: 'GET',
            headers: utilities.Interceptor.getHeaders(),

        }).then((response) => response.json())
            .then((result) => {
                let redeemInfo = ''
                if (result.status) {
                    dispatch(TASKS.hideLoader());
                    let redeemInfo = result.data
                    dispatch(storeRedeemInfo(redeemInfo))
                }else{
                    dispatch(storeRedeemInfo(redeemInfo))
                    dispatch(TASKS.hideLoader());
                    utilities.backendErrorMessage(result.errors.error, result.errors.error);
                }
            }).catch((error) => {
                alert(error)
                dispatch(TASKS.hideLoader());
                utilities.backendErrorMessage(error, "Something went wrong!");
            })

    }
}
export const registerCard = params => {
    return async dispatch => {
        dispatch(TASKS.showLoader());
        dispatch(TASKS.apiResponse(false))
        dispatch(TASKS.apiResponseText(''))
        dispatch(setIsConnectCardRequest(false))
        fetch(`${utilities.BASE_URL}clientcard/create`,{
            method: 'POST',
            headers: utilities.Interceptor.getHeaders(),
            body: JSON.stringify(
                {
                    first_name:params.first_name,
                    last_name:params.last_name,
                    email:params.email,
                    phone_number:params.phone_number,
                }
            ),
        }).then((response) => response.json())
            .then((result) => {
                
                if (result.status) {
                    dispatch(TASKS.hideLoader());
                    utilities.navigate('CardVerification')    
                }else{
                    // if (result.code == '-1') {
                        // utilities.backendErrorMessage(result.errors.type,"You have aleady registered card with this number.");
                    // }else{
                        // dispatch(TASKS.hideLoader());
                        // utilities.backendErrorMessage("kjhkh", "Something went wrong!");    
                        dispatch(TASKS.apiResponse(false))
                        dispatch(TASKS.apiResponseText(result.errors.error))
                        dispatch(TASKS.hideLoader());
                    // }
                        
                }
                
            }).catch((error) => {
                
                dispatch(TASKS.hideLoader());
                utilities.backendErrorMessage(error, "There seems to be a problem, Please try again later.!");
            })
        
    }
}

export const verifyCard = params => {
    return dispatch => {
        dispatch(TASKS.showLoader());
        let url = utilities.BASE_URL+'clientcard/activate?verify_code='+params.verificationCode
        fetch(`${url}`,{
            method: 'POST',
            headers: utilities.Interceptor.getHeaders()
        }).then((response) => response.json())
            .then((result) => {
                
                if (result.status) {
                    // dispatch(TASKS.hideLoader());
                    if (!result.errors) {
                        let user = result.data.user;
                        user.points = result.data.points;
                        dispatch(updateUser(user));
                        dispatch(getPickupLocations(user.clientcard.card_loyalty))
                        // utilities.navigate('CardPickupLocation')
                        //utilities.navigate('CardSuccess')
                    }else{
                       utilities.backendErrorMessage(error, "Code Does Not Match!"); 
                    }
                }else{
                    dispatch(TASKS.hideLoader());
                    utilities.backendErrorMessage(error, "Code required");
                }
            }).catch((error) => {
                
                dispatch(TASKS.hideLoader());
                utilities.backendErrorMessage(error, "There seems to be a problem, Please try again later.!");
            })
    }
}

export const resendVerificationCode = () =>{
    return dispatch => {
        dispatch(TASKS.apiResponse(null))
        dispatch(TASKS.apiResponseCode(null))
        fetch(`${utilities.BASE_URL}clientcard/resend-verificationcode`,{
            method:'POST',
            headers:utilities.Interceptor.getHeaders()
        }).then((response) => response.json())
            .then((result) => {
                if (result.status) {
                    dispatch(TASKS.apiResponse(true))
                    dispatch(TASKS.apiResponseCode(200))
                }else{
                    dispatch(TASKS.apiResponse(false))
                    dispatch(TASKS.apiResponseCode(404))
                }
            }).catch((error) => {
                dispatch(TASKS.apiResponse(false))
                dispatch(TASKS.apiResponseCode(404))
            })
    }
}

export const getPickupLocations = cardNumber => {
    return dispatch => {
        dispatch(TASKS.showLoader())
        dispatch({
            type: TYPES.STORE_PICKUP_LOCATIONS,
            locations: []
        })
        fetch(`${utilities.BASE_URL}clientcard/pickup-locations?card=${cardNumber}`, {
            method:'GET',
            headers: utilities.Interceptor.getHeaders()
        }).then((response) => response.json())
            .then((result) => {

                
                let _locationSelected = false;
                if (result.status) {
                    result.data.map((location,index) => {
                        if (location.selected) {
                            _locationSelected = true;
                            dispatch({
                                type:TYPES.SET_EMBOSED_STATUS,
                                payload:{
                                    crd_em_status:true,
                                    crd_pickup_location:location.location
                                }
                            })
                            utilities.navigate('CardSuccess')
                        }
                    })
                    if (!_locationSelected) {
                        dispatch({
                            type: TYPES.STORE_PICKUP_LOCATIONS,
                            locations: result.data
                        })
                        utilities.navigate('CardPickupLocation')
                    }
                }
                dispatch(TASKS.hideLoader())
            }).catch((error) => {
                
            })
    }
}

export const requestEmbosedCard = params => {
    return dispatch => {
        dispatch(TASKS.showLoader())
        fetch(`${utilities.BASE_URL}clientcard/request-embossed-card`,{
            method:'POST',
            headers:utilities.Interceptor.getHeaders(),
            body:JSON.stringify({
                card:params.card_loyalty,
                mlidLoc:params.location.value
            })
        }).then((response) => response.json())
            .then((result) => {
                
                if (result.status) {
                    dispatch({
                        type:TYPES.SET_EMBOSED_STATUS,
                        payload:{
                            crd_em_status:true,
                            crd_pickup_location:params.location.label
                        }
                    })
                    dispatch(TASKS.hideLoader())
                    utilities.navigate('CardSuccess')
                }
            }).catch((error) => {

            })
    }
}
export const fetchCardPoints = cardNumber => {
    return dispatch => {
        fetch(`${utilities.BASE_URL}clientcard/balance?card=${cardNumber}`,{
            method:'GET',
            headers: utilities.Interceptor.getHeaders()
        }).then((response) => response.json())
            .then((result) => {
                
                if (result.status) {
                    dispatch({
                        type: TYPES.FETCHED_CARD_POINTS,
                        points: result.data.points
                    })
                }
            }).catch((error) => {
                console.log('card point error',error)
            })
    }
}

export const connectCard = cardNumber => {
    return dispatch => {
        console.log('2')
        dispatch(TASKS.apiResponseCode(0))
        dispatch(TASKS.showLoader());
        dispatch(TASKS.apiResponse(false))
        dispatch(TASKS.apiResponseText(''))
        dispatch(setIsConnectCardRequest(false))
        let url = utilities.BASE_URL+'clientcard/connect-advance?card='+cardNumber
        fetch(`${url}`,{
            method:'GET',
            headers: utilities.Interceptor.getHeaders()
        }).then((response) => response.json())
            .then((result) => {
                console.log('result', result)
                dispatch(TASKS.hideLoader())
                if (result.status) {
                        dispatch(setIsConnectCardRequest(true))
                        dispatch(TASKS.hideLoader());
                        utilities.navigate("CardVerification");
                }else{
                    if (result.code == 422) {
                        dispatch(TASKS.apiResponse(false))
                        dispatch(TASKS.apiResponseText(result.errors.error.card))
                        dispatch(TASKS.hideLoader());
                        // utilities.backendErrorMessage(result.errors.error.card, result.errors.error.card);   
                    }else if(result.code == 999){
                        dispatch({
                            type:TYPES.MISMATCH_CONNECT_CARD_INFO,
                            mismatchCardInfo:result.data
                        })
                        dispatch(TASKS.apiResponseCode(999))

                    }

                    else{
                        dispatch(TASKS.apiResponse(false))
                        dispatch(TASKS.apiResponseText(result.errors.error))
                        dispatch(TASKS.hideLoader());
                        // utilities.backendErrorMessage(result.errors.error, result.errors.error);
                    }
                        
                }

            }).catch((error) => {
                dispatch(TASKS.hideLoader());
                utilities.backendErrorMessage(error, "There seems to be a problem, please try again later.")
            })    
    }
    
}

export const sendCustomVerification = params => {
    return dispatch => {
        dispatch(TASKS.showLoader())
        dispatch(setIsConnectCardRequest(false))
        fetch(`${utilities.BASE_URL}clientcard/verificaton-advance`, {
            method: 'POST',
            headers: utilities.Interceptor.getHeaders(),
            body: JSON.stringify(params)
        }).then((response) => response.json())
            .then((result) => {
                dispatch(TASKS.hideLoader())
                if (result.status) {
                    dispatch(setIsConnectCardRequest(true))
                    dispatch(TASKS.hideLoader())
                    utilities.navigate("CardVerification")
                }
            })
    }
}

export const removeCard = () => {
    return dispatch => {
        dispatch(TASKS.showLoader());
        fetch(`${utilities.BASE_URL}clientcard/removecard`,{
            method:'GET',
            headers: utilities.Interceptor.getHeaders()
        }).then((response) => response.json())
            .then((result) => {
                dispatch(TASKS.hideLoader());
                
                if (result.status) {
                    let user = result.data.user
                    dispatch(updateUser(user));
                    utilities.navigate("Home")
                }else{
                    dispatch(TASKS.hideLoader());
                    utilities.backendErrorMessage(error, "There seems to be a problem, please try again later.")
                }
            }).catch((error) => {
                dispatch(TASKS.hideLoader());
                utilities.backendErrorMessage(error, "There seems to be a problem, please try again later.")
            })
    }
}

