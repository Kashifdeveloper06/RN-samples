import * as TASKS from "../index";
// import * as Util from '../../../services/index';
import * as utilities from "../../../utilities";
import * as TYPES from "../../types";

const onboardingToggle = () => {
  return {
    type: TYPES.ONBOARDING_OFF,
  };
};
export const turnOffOnboarding = (params) => {
  return (dispatch) => {
    dispatch(onboardingToggle());
  };
};

export const guestHome = (country) => {
  return (dispatch) => {
    if (country) {
      dispatch(TASKS.showLoader());
      fetch(`${utilities.BASE_URL}guest-home?country=${country}`)
        .then((response) => response.json())
        .then((result) => {
          console.log("guest home", result);
          dispatch(TASKS.hideLoader());
          if (result.status == true) {
            dispatch({
              type: TYPES.FETCHED_PROMOTIONS,
              payload: result.data.promotions,
            });
            dispatch({
              type: TYPES.FETCHED_COUPONS,
              payload: result.data.coupons,
            });

            // dispatch({
            //     type: TYPES.FETCH_PROMOTIONS,
            //     promotions: result.data

            // })
            // utilities.navigate('Home')
          } else {
            throw result;
          }
        })
        .catch((error) => {
          console.log("promo error", error);
          dispatch(TASKS.hideLoader());
          // utilities.backendErrorMessage(error, "No Location Provided!");
          // utilities.navigate('Login')
        });
    } else {
      dispatch({
        type: TYPES.FETCH_PROMOTIONS,
        promotions: [],
      });
    }
  };
};
export const fetchPromotions = (country) => {
  console.log(utilities.BASE_URL);
  return (dispatch) => {
    if (country) {
      dispatch(TASKS.showLoader());
      fetch(`${utilities.BASE_URL}promotions?country=${country}`, {
        // method: 'GET',
        headers: utilities.Interceptor.getHeaders(),
        // body: JSON.stringify(params),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("promos", result);
          dispatch(TASKS.hideLoader());
          if (result.status == true) {
            dispatch({
              type: TYPES.FETCHED_PROMOTIONS,
              payload: result.data.promotions,
            });
            // dispatch({
            //     type: TYPES.FETCH_PROMOTIONS,
            //     promotions: result.data

            // })
            // utilities.navigate('Home')
          } else {
            throw result;
          }
        })
        .catch((error) => {
          console.log("promo error", error);
          dispatch(TASKS.hideLoader());
          utilities.backendErrorMessage(error, "No Location Provided!");
          // utilities.navigate('Login')
        });
    } else {
      dispatch({
        type: TYPES.FETCH_PROMOTIONS,
        promotions: [],
      });
    }
  };
};
export const getPromotionBundles = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    fetch(
      `${utilities.BASE_URL}promotions/get-bundles?id= ${params.promo_id}`,
      {
        // method: 'GET',
        headers: utilities.Interceptor.getHeaders(),
        // body: JSON.stringify(params),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        dispatch(TASKS.hideLoader());
        if (result.status == true) {
          console.log("result", result);
          // dispatch(storeUser(result.data));
          dispatch({
            type: TYPES.PROMOTION_BUNDLES,
            promotionBundles: result.data,
          });
          utilities.navigate("PromotionBundles");
        } else {
          throw result;
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideLoader());
        utilities.backendErrorMessage(error, "Something Went Wrong !");
        utilities.navigate("Home");
      });
  };
};
export const promotionsDetails = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    fetch(`${utilities.BASE_URL}promotions/detail?id= ${params.promo_id}`, {
      // method: 'GET',
      headers: utilities.Interceptor.getHeaders(),
      // body: JSON.stringify(params),
    })
      .then((response) => response.json())
      .then((result) => {
        dispatch(TASKS.hideLoader());
        if (result.status == true) {
          // dispatch(storeUser(result.data));
          dispatch({
            type: TYPES.PROMOTIONS_DETAILS,
            promoDetails: result.data,
          });
          utilities.navigate("PromotionDetails");
        } else {
          throw result;
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideLoader());
        utilities.backendErrorMessage(error, "Something Went Wrong !");
        utilities.navigate("Home");
      });
  };
};
export const getOfferDetails = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    fetch(
      `${utilities.BASE_URL}promotions/product/detail?promotion_id=${
        params.promo_id
      }&product_id=${params.product_id}`,
      {
        // method: 'GET',
        headers: utilities.Interceptor.getHeaders(),
        // body: JSON.stringify(params),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        dispatch(TASKS.hideLoader());
        console.log('offer detail result', result)
        if (result.status == true) {
          // dispatch(storeUser(result.data));
          dispatch({
            type: TYPES.OFFER_DETAILS,
            offerDetails: result.data,
          });
          if (params.detailFromNotification == true) {
          } else {
            utilities.navigate("OfferDetail");
          }
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
export const getCouponDetails = (params) => {
  console.log("coupon details param", params);
  return (dispatch) => {
    dispatch({
      type: TYPES.COUPON_DETAILS,
      couponDetails: null,
    });
    dispatch(TASKS.showLoader());
    fetch(`${utilities.BASE_URL}coupons/detail?id=${params.coupon_id}`, {
      // method: 'GET',
      headers: utilities.Interceptor.getHeaders(),
      // body: JSON.stringify(params),
    })
      .then((response) => response.json())
      .then((result) => {
        dispatch(TASKS.hideLoader());
        if (result.status == true) {
          console.log("coupon details", result);
          //console.log(result.data)
          // dispatch(storeUser(result.data));
          dispatch({
            type: TYPES.COUPON_DETAILS,
            couponDetails: result.data,
          });

          if (result.data.coupon_detail.type == "mix_and_match") {
            if (
              result.data.coupon_detail.mix_and_match_type ==
              "different_cost_products"
            ) {
              //This is the current coupon details which I djusted to show mix and match with different cost
              utilities.navigate("CouponDetail");
            } else {
              //navigation to show mix and match for same products
              //unComment once the compnonent is creted
              utilities.navigate("MnmSameProductDetail");
            }
          } else {
            //Navigation for Standard Bundle, Uncomment when Component is ready
            utilities.navigate("StdBundleDetail");
          }

          // if(params.detailFromNotification == true) {
          // } else {
          //     utilities.navigate('CouponDetail')
          // }
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

export const toggleCardScan = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    fetch(`${utilities.BASE_URL}coupons/update`, {
      method: "POST",
      headers: utilities.Interceptor.getHeaders(),
      body: JSON.stringify({
        id: params.coupon_id,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        dispatch(TASKS.hideLoader());
        if (result.status == true) {
          dispatch({
            type: TYPES.TOGGLE_CARD_SCAN,
            cardScan: result.data,
          });
          dispatch({
            type: TYPES.UPDATE_COUPON_STATE,
            payload: {
              coupon_id: params.coupon_id,
              couponState: params.couponState,
            },
          });
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

export const getCoupons = (country) => {
  return (dispatch) => {
    if (country) {
      dispatch(TASKS.showLoader());
      fetch(`${utilities.BASE_URL}coupons-new?country=${country}`, {
        headers: utilities.Interceptor.getHeaders(),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("coupons home", result);
          dispatch(TASKS.hideLoader());
          console.log('COUPONS', result)
          if (result.status) {
            dispatch({
              type: TYPES.FETCHED_COUPONS,
              payload: result.data.coupons,
            });
          } else {
            dispatch({
              type: TYPES.FETCHED_COUPONS,
              coupons: [],
            });
          }
        })
        .catch((error) => {
          console.log("promo error", error);
          dispatch(TASKS.hideLoader());
          // utilities.backendErrorMessage(error, "No Location Provided!");
        });
    } else {
      dispatch({
        type: TYPES.FETCHED_COUPONS,
        coupons: [],
      });
    }
  };
};

export const getFeaturedCoupons = (country) => {
    console.log('fetchpromotions', country)
  return (dispatch) => {
    if (country) {
      dispatch(TASKS.showLoader());
      fetch(`${utilities.BASE_URL}coupons/featured?country=${country}`, {
        headers: utilities.Interceptor.getHeaders(),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("coupons home", result);
          dispatch(TASKS.hideLoader());
          if (result.status) {
            console.log("coupon daata", result.data);
            dispatch({
              type: TYPES.FETCHED_FEATURED_COUPONS,
              payload: result.data.coupons,
            });
          } else {
            dispatch({
              type: TYPES.FETCHED_FEATURED_COUPONS,
              coupons: [],
            });
          }
        })
        .catch((error) => {
          console.log("promo error", error);
          dispatch(TASKS.hideLoader());
          // utilities.backendErrorMessage(error, "No Location Provided!");
        });
    } else {
      dispatch({
        type: TYPES.FETCHED_FEATURED_COUPONS,
        coupons: [],
      });
    }
  };
};
