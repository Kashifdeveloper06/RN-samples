import * as TASKS from "../index";
// import * as Util from '../../../services/index';
import * as utilities from "../../../utilities";
import * as TYPES from "../../types";
let SOCIAL_TOKEN = "";
// import * as CONSTANTS from '../../../services/constants/constants';

export const storeUser = (user) => {
  return {
    type: TYPES.ADD_USER,
    user: user,
  };
};
const saveStores = (stores) => {
  return {
    type: TYPES.SAVE_STORES,
    stores: stores,
  };
};
const logout = () => {
  return {
    type: TYPES.LOGOUT,
    user: null,
  };
};
const storePicture = (image) => {
  return {
    type: TYPES.ADD_PICTURE,
    picture: image,
  };
};

const storeUserPicture = (image) => {
  return {
    type: TYPES.ADD_USER_PICTURE,
    image: image,
  };
};
const storeLocation = (country) => {
  return {
    type: TYPES.ADD_COUNTRY,
    country: country,
  };
};

const saveCustomerCareInfo = (customerCareInfo) => {
  return {
    type: TYPES.SAVE_CUSTOMER_CARE_INFO,
    customerCareInfo: customerCareInfo,
  };
};
export const storeFailedRegisteredEmail = (email) => {
  return {
    type: TYPES.FAILED_REGISTERED_EMAIL,
    failedRegisteredEmail: email,
  };
};

export const resgisterAsGuest = (status) => {
  return {
    type: TYPES.IS_GUEST_USER,
    isGuestUser: status,
  };
};

// // manipulateResult = (dispatch, result) => {
// //     dispatch(storeUser(result.data));
// //     Util.navigate('StartUp');
// // }

export const getDefaultCountries = () => {
  return (dispatch) => {
    fetch(`${utilities.BASE_URL}countries`)
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          dispatch({
            type: TYPES.DEFAULT_COUNTRIES,
            defaultCountries: result.data.countries,
          });
        }
      })
      .catch((error) => {
        console.log("country error", error);
      });
  };
};

export const fetchCustomerCareInfo = (params) => {
  return (dispatch) => {
    let url = utilities.BASE_URL + "customercare/detail?country=" + params;
    fetch(`${url}`, {
      method: "GET",
      headers: utilities.Interceptor.getHeaders(),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          if (result.data.customer_care_info) {
            dispatch(saveCustomerCareInfo(result.data.customer_care_info));
          }
        }
      });
  };
};

export const loginUser = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    dispatch(TASKS.apiResponse(null));
    dispatch(TASKS.apiResponseText(null));
    fetch(`${utilities.BASE_URL}login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: params.email,
        password: params.password,
        player_id: params.player_id,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        dispatch(TASKS.hideLoader());
        if (result.status) {
          if (result.data) {
            dispatch(resgisterAsGuest(false));
            if (result.data.user) {
              var user = result.data.user;
              user.token = result.data.user_access_token;
              dispatch(storeUser(user));
              if (result.data.user.user_info) {
                // if (result.data.user.user_info.country) {
                //     dispatch(storeLocation(result.data.user.user_info.country))
                // }
                if (result.data.user.user_info.image) {
                  dispatch(storePicture(result.data.user.user_info.image));
                }
              }
            }

            if (result.data.customer_care_info) {
              dispatch(saveCustomerCareInfo(result.data.customer_care_info));
            }
          }
          utilities.navigate("Home");
        } else {
          dispatch(TASKS.apiResponse(false));
          dispatch(TASKS.apiResponseText(result.errors.error));
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideLoader());
        utilities.backendErrorMessage(error, "Wrong Credentials!");
      });
  };
};
export const signinWithApple = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    fetch(`${utilities.BASE_URL}social/auth/apple`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("result", result);
        dispatch(TASKS.hideLoader());
        if (result.status) {
          if (result.data) {
            dispatch(resgisterAsGuest(false));
            if (result.data.user) {
              var user = result.data.user;
              user.token = result.data.user_access_token;
              dispatch(storeUser(user));
              if (result.data.user.user_info) {
                // if (result.data.user.user_info.country) {
                //     dispatch(storeLocation(result.data.user.user_info.country))
                // }
                if (result.data.user.user_info.image) {
                  dispatch(storePicture(result.data.user.user_info.image));
                }
              }
            }

            if (result.data.customer_care_info) {
              dispatch(saveCustomerCareInfo(result.data.customer_care_info));
            }
            if (
              result.data.is_new == 1 ||
              !result.data.user.user_info.country
            ) {
              utilities.navigate("RegisterStep1");
            } else {
              dispatch(resgisterAsGuest(false));
              utilities.navigate("Home");
            }
          }
          // utilities.navigate('Home');
        } else {
          dispatch(TASKS.apiResponse(false));
          dispatch(TASKS.apiResponseText(result.errors.error));
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideLoader());
        utilities.backendErrorMessage(error, "Wrong Credentials!");
      });
  };
};
export const logoutUser = (params) => {
  return (dispatch) => {
    dispatch({
      type: TYPES.FETCH_LISTS,
      fetchListing: params,
    });
    utilities.Interceptor.setToken(null);
    utilities.navigate("Login");
    dispatch(logout());
    // dispatch(saveStores(params));
    dispatch(storePicture(params));
    dispatch(storeLocation(params));
    dispatch({
      type: TYPES.SAVE_SOCIAL_OBJECT,
      payload: {
        socialObj: params,
      },
    });
    dispatch({
      type: TYPES.FETCHED_PROMOTIONS,
      payload: params,
    });
    dispatch({
      type: TYPES.FETCHED_COUPONS,
      payload: params,
    });
    dispatch({
      type: TYPES.STORE_REDEEM_INFO,
      redeemInfo: params,
    });
    dispatch({
      type: TYPES.ACTIVELIST,
      list_id: null,
    });
  };
};
export const storeCountry = (params) => {
  return (dispatch) => {
    dispatch(storeLocation(params));
  };
};

const storeCountriesList = (countryList) => {
  return (dispatch) => {
    dispatch({
      type: TYPES.STORED_COUNTRY_LIST,
      countryList: countryList,
    });
  };
};

export const getclientStores = () => {
  return (dispatch) => {
    fetch(`${utilities.BASE_URL}stores`)
      .then((response) => response.json())
      .then((result) => {
        console.log("client Stores", result);
        if (result.status) {
          dispatch(saveStores(result.data));
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
};
export const loginUserSocial = (params) => {
  console.log("params", params);
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    fetch(`${utilities.BASE_URL}social/auth`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: params.first_name,
        last_name: params.last_name,
        email: params.email,
        provider: params.provider,
        provider_id: params.provider_id,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("socialLogin result", result);
        dispatch(TASKS.hideLoader());
        if (result.status) {
          if (result.data) {
            if (result.data.user) {
              
              utilities.Interceptor.setToken(result.data.user_access_token);
              dispatch(storeUser(result.data.user));
              dispatch(storePicture(result.data.user.user_info.image));
            }
            //   // if(result.data.stores){
            //   //     dispatch(saveStores(result.data.stores));
            //   // }
            if (result.data.customer_care_info) {
              dispatch(saveCustomerCareInfo(result.data.customer_care_info));
            }
            if (
              result.data.is_new == 1 ||
              !result.data.user.user_info.country
            ) {
              utilities.navigate("RegisterStep1");
            } else {
              dispatch(resgisterAsGuest(false));
              utilities.navigate("Home");
            }
          }
        } else {
          throw result;
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideLoader());
        utilities.backendErrorMessage(error, "Wrong Credentials!");
      });
  };
};
export const saveSocialObj = (params) => {
  return (dispatch) => {
    dispatch({
      type: TYPES.SAVE_SOCIAL_OBJECT,
      payload: {
        socialObj: params,
      },
    });
  };
};

export const updateUserProfileInfo = (payload) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    fetch(`${utilities.BASE_URL}user/profile/update`, {
      method: "POST",
      headers: utilities.Interceptor.getHeaders(),
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("user update result", result);
        dispatch(TASKS.hideLoader());
        if (result.status) {
          dispatch({
            type: TYPES.UPDATE_USER_PROFILE,
            payload: payload,
          });
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideLoader());
      });
  };
};
export const checkEmail = (email) => {
  return (dispatch) => {
    dispatch(TASKS.apiResponse(null));
    dispatch(TASKS.apiResponseCode(null));
    dispatch(TASKS.apiResponseText(null));
    dispatch({
      type: TYPES.FAILED_REGISTERED_EMAIL,
      failedRegisteredEmail: null,
    });
    fetch(`${utilities.BASE_URL}check-email?email=${email}`)
      .then((response) => response.json())
      .then((result) => {
        dispatch(TASKS.hideLoader());
        if (!result.status) {
          dispatch(storeFailedRegisteredEmail(email));
          dispatch(TASKS.apiResponseText(result.errors.error.email[0]));
          dispatch(TASKS.apiResponse(false));
          dispatch(TASKS.apiResponseCode(422));
        } else {
          dispatch(storeFailedRegisteredEmail(null));
          dispatch(TASKS.apiResponseText(null));
          dispatch(TASKS.apiResponse(true));
          dispatch(TASKS.apiResponseCode(200));
        }
      })
      .catch((error) => {});
  };
};
export const registerUser = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    fetch(`${utilities.BASE_URL}register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: params.first_name,
        last_name: params.last_name,
        email: params.email,
        password: params.password,
        phone_number: params.phone_number,
        date_of_birth: params.date_of_birth,
        city: params.city,
        country: params.country,
        user_id: params.user_id,
        image: params.image,
        gender: params.gender,
        player_id: params.player_id,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        dispatch(TASKS.hideLoader());
        if (result.status == true) {
          if (result.data) {
            if (result.data.user) {
              if (result.data.user_access_token != null) {
                var user = result.data.user;
                user.token = result.data.user_access_token;
                dispatch(storeUser(user));
              } else {
                var user = result.data.user;
                var socialUser = { ...user, token: SOCIAL_TOKEN };
                SOCIAL_TOKEN = "";
                dispatch(storeUser(socialUser));
              }

              //dispatch(storeUser(result.data.user));
              if (result.data.user.user_info) {
                // if (result.data.user.user_info.country) {
                //     dispatch(storeLocation(result.data.user.user_info.country))
                // }
                if (result.data.user.user_info.image) {
                  dispatch(storePicture(result.data.user.user_info.image));
                }
              }
            }
            dispatch({
              type: TYPES.MLS_STATUS,
              mlsStatus: result.data.mls_service_active,
            });
            dispatch(resgisterAsGuest(false));
            // if(result.data.stores){
            //     dispatch(saveStores(result.data.stores));
            // }
            if (result.data.customer_care_info) {
              dispatch(saveCustomerCareInfo(result.data.customer_care_info));
            }
          }
          utilities.navigate("Home");
        } else {
          throw result;
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideLoader());
        utilities.backendErrorMessage(error, "Something Went wrong!");
      });
  };
};

export const getMlsStatus = (params) => {
  return (dispatch) => {
    fetch(`${utilities.BASE_URL}mls-service-status`, {
      method: "GET",
      headers: utilities.Interceptor.getHeaders(),
    })
      .then((response) => response.json())
      .then((result) => {
        dispatch({
          type: TYPES.MLS_STATUS,
          mlsStatus: result.data.mls_service_status,
        });
      })
      .catch((error) => {});
  };
};
export const clearLocations = () => {
  return (dispatch) => {
    dispatch({
      type: TYPES.COUNTRY_LOCATION_STORED,
      payload: null,
    });
  };
};
export const getCountryLocations = (country) => {
  return (dispatch) => {
    // dispatch({
    //   type: TYPES.COUNTRY_LOCATION_STORED,
    //   payload: [],
    // });
    dispatch(TASKS.showLoader());
    fetch(`${utilities.BASE_URL}areas?country=${country}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log('result LOCATION', result)
        dispatch(TASKS.hideLoader());
        if (result.status) {
          let _locations = [];
          result.data.map((location, i) => {
            let _location = {
              label: location.name,
              value: location.name,
            };
            _locations.push(_location);
          });
          dispatch({
            type: TYPES.COUNTRY_LOCATION_STORED,
            payload: _locations,
          });
        }
      })
      .catch((error) => {
        console.log("[LOCATION ERROR]", error);
      });
  };
};

export const uploadImage = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    fetch(`${utilities.BASE_URL}profile-image/upload`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: params.image,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        dispatch(TASKS.hideLoader());
        //console.log('hala kimage uploader jeee',result)

        if (result.status == true) {
          dispatch(storePicture(result.data.url));
        } else {
          throw result;
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideLoader());
        utilities.backendErrorMessage(error, "Try Again");
      });
  };
};
export const updateUserImage = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    fetch(`${utilities.BASE_URL}user/profile/update/image`, {
      method: "POST",
      headers: utilities.Interceptor.getHeaders(),
      body: JSON.stringify({
        image: params.image,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        dispatch(TASKS.hideLoader());
        if (result.status == true) {
          dispatch(storeUserPicture(result.data.url));
        } else {
          throw result;
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideLoader());
        utilities.backendErrorMessage(error, "Try Again");
      });
  };
};
export const changePassword = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    fetch(`${utilities.BASE_URL}user/password/update`, {
      headers: utilities.Interceptor.getHeaders(),
      method: "POST",
      body: JSON.stringify({
        current_password: params.current_password,
        new_password: params.new_password,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        dispatch(TASKS.hideLoader());
        //console.log('update password responce',result)
        if (result.status == true) {
          utilities.navigate("PersonalInformation");
          utilities.showToast("Password Changed Successfully.");
        } else {
          throw result;
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideLoader());
        utilities.backendErrorMessage(error, "Please Try Again");
      });
  };
};

export const forgotPassword = (params) => {
  // alert(params)
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    dispatch(TASKS.apiResponse(false));
    dispatch(TASKS.apiResponseText(""));
    fetch(`${utilities.BASE_URL}user/password/forgot`, {
      headers: utilities.Interceptor.getHeaders(),
      method: "POST",
      body: JSON.stringify({
        email: params,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          dispatch(TASKS.apiResponse(true));
          dispatch(
            TASKS.apiResponseText(
              "Email sent! Please check your email for new password."
            )
          );
          dispatch(TASKS.hideLoader());
        } else {
          dispatch(TASKS.apiResponse(false));
          dispatch(TASKS.apiResponseText(result.errors.error));
          dispatch(TASKS.hideLoader());
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideLoader());
        utilities.backendErrorMessage(
          error,
          "Something went wrong, please try again."
        );
      });
  };
};
export const sendCustomerCareEmail = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    dispatch(TASKS.apiResponse(false));
    dispatch(TASKS.apiResponseText(""));
    fetch(`${utilities.BASE_URL}customercare/send-email`, {
      method: "POST",
      headers: utilities.Interceptor.getHeaders(),
      body: JSON.stringify({
        to: params.to,
        subject: params.subject,
        message: params.message,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          dispatch(TASKS.apiResponse(true));
          dispatch(TASKS.apiResponseText("Message sent. Thank you!"));
          dispatch(TASKS.hideLoader());
        } else {
          dispatch(TASKS.apiResponse(false));
          dispatch(
            TASKS.apiResponseText(
              "There is a problem sending messages, please try again later."
            )
          );
          dispatch(TASKS.hideLoader());
        }
      })
      .catch((error) => {
        dispatch(TASKS.apiResponse(false));
        dispatch(
          TASKS.apiResponseText(
            "There is a problem sending messages, please try again later."
          )
        );
        dispatch(TASKS.hideLoader());
      });
  };
};

export const refreshToken = (userId) => {
  return (dispatch) => {
    fetch(`${utilities.BASE_URL}refresh-user-access-token?id=${userId}`)
      .then((response) => response.json())
      .then((result) => {
        console.log("refresh token", result);
        if (result.status) {
          dispatch({
            type: TYPES.SET_USER_ACCESS_TOKEN,
            user_access_token: result.data.user_access_token,
          });
          utilities.Interceptor.setToken(result.data.user_access_token);

          utilities.navigate("Home");
        }
      });
  };
};
export const fetchNotifications = (params) => {
  console.log("paramsssssss", utilities.Interceptor.getHeaders());
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    fetch(`${utilities.BASE_URL}notifications`, {
      // method: 'GET',
      headers: utilities.Interceptor.getHeaders(),
      // body: JSON.stringify(params),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("fetch notificationssss", result);
        dispatch(TASKS.hideLoader());
        if (result.status == true) {
          dispatch({
            type: TYPES.FETCH_NOTIFICATIONS,
            fetchedNotifications: result.data,
          });
          // utilities.navigate('Notifications')
        } else {
          throw result;
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideLoader());
        console.log(
          "kjhjkhkhkhkjhjkhjkhkhkhjkhjkhjkhkjhjkhkjhjkhjkhkjhhkjhkjhkj"
        );
        utilities.backendErrorMessage(error, "Something Went Wrong !");
      });
  };
};

export const updateNotification = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    fetch(`${utilities.BASE_URL}notifications/update`, {
      headers: utilities.Interceptor.getHeaders(),
      method: "POST",
      body: JSON.stringify({
        id: params.object_id,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        dispatch(TASKS.hideLoader());
        //console.log('update password responce',result)
        if (result.status == true) {
        } else {
          throw result;
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideLoader());
        utilities.backendErrorMessage(error, "Please Try Again");
      });
  };
};

export const getNotificationsCount = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    fetch(`${utilities.BASE_URL}notifications/count`, {
      // method: 'GET',
      headers: utilities.Interceptor.getHeaders(),
      // body: JSON.stringify(params),
    })
      .then((response) => response.json())
      .then((result) => {
        dispatch(TASKS.hideLoader());
        if (result.status == true) {
          dispatch({
            type: TYPES.GET_NOTIFICATIONS_COUNT,
            notificationsCount: result.data,
          });
          // utilities.navigate('UserProfile')
        } else {
          throw result;
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideLoader());
        utilities.backendErrorMessage(error, "Something Went Wrong !");
      });
  };
};

export const FetchOrdersList = () => {
  return (dispatch) => {
    let url = utilities.BASE_URL + "user/orders";
    fetch(`${url}`, {
      method: "GET",
      headers: utilities.Interceptor.getHeaders(),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("ORDERS from api", result.data);
        dispatch({
          type: TYPES.FETCH_ORDER,
          Orders: result.data.orderLists,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
