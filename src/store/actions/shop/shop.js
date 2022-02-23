import * as TASKS from "../index";
// import * as Util from '../../../services/index';
import * as utilities from "../../../utilities";
import * as TYPES from "../../types";

export const fetchShopCoupon = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showshopLoader());
    fetch(`${utilities.BASE_URL}coupons/detail/multiple`, {
      method: "POST",
      headers: utilities.Interceptor.getHeaders(),
      body: JSON.stringify(params),
    })
      .then((response) => response.json())
      .then((result) => {
        dispatch(TASKS.hideshopLoader());
        if (result.status == true) {
          console.log("result", result);
          // dispatch(storeUser(result.data));
          dispatch({
            type: TYPES.FETCHED_SHOP_COUPONS,
            ShopCoupons: result.data,
          });
          // utilities.navigate("PromotionBundles");
        } else {
          throw result;
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideshopLoader());
        utilities.backendErrorMessage(error, "Something Went Wrong !");
        //   utilities.navigate("Home");
      });
  };
};

export const getShopCoupondetails = (params) => {
  console.log("coupon details param", params);
  return (dispatch) => {
    dispatch({
      type: TYPES.COUPON_DETAILS,
      couponDetails: null,
    });
    // dispatch(TASKS.showLoader());
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
            type: TYPES.SHOP_COUPON_DETAILS,
            couponsDetails: result.data,
          });

          if (result.data.coupon_detail.type == "mix_and_match") {
            if (
              result.data.coupon_detail.mix_and_match_type ==
              "different_cost_products"
            ) {
              //This is the current coupon details which I djusted to show mix and match with different cost
              utilities.navigate("MnmDifferentShop", {
                routeName: params.routeParam,
              });
            } else {
              //navigation to show mix and match for same products
              //unComment once the compnonent is creted
              utilities.navigate("MnmSameBundleShop", {
                routeName: params.routeParam,
              });
            }
          } else {
            //Navigation for Standard Bundle, Uncomment when Component is ready
            utilities.navigate("StdBundleDetailsShop", {
              routeName: params.routeParam,
            });
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

export const getListItemsBundles = (list_id) => {
  return (dispatch) => {
    dispatch(TASKS.showListItemsLoader());
    dispatch({
      type: TYPES.FETCH_LIST_ITEMS,
      fetchedListItems: null,
    });
    fetch(`${utilities.BASE_URL}lists/items-and-bundles?list_id=${list_id}`, {
      headers: utilities.Interceptor.getHeaders(),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("GET LIST ITEMS", result);
        if (result.status == true) {
          dispatch({
            type: TYPES.FETCH_LIST_ITEMS,
            fetchedListItems: result.data,
          });
        } else {
          throw result;
        }
        dispatch(TASKS.hideListItemsLoader());
      })
      .catch((error) => {
        dispatch(TASKS.hideListItemsLoader());
        console.log("error", error);
        //utilities.backendErrorMessage(error, "Something Went Wrong !");
      });
    // dispatch(TASKS.hideListItemsLoader())
  };
};

export const showshopLoader = () => {
  return {
    type: TYPES.SHOW_SHOP_LOADER,
  };
};

export const hideshopLoader = () => {
  return {
    type: TYPES.HIDE_SHOP_LOADER,
  };
};

export const categoryProductsShop = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());

    fetch(
      `${utilities.BASE_URL}category/products?category_id=${params.cat_id}`,
      {
        method: "GET",
        headers: utilities.Interceptor.getHeaders(),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status == true) {
          dispatch(TASKS.hideLoader());
          dispatch({
            type: TYPES.GETCATEGORYPRODUCTS,
            categoryProducts: result.data.products,
            cat_id: params.cat_id,
            dept_id: params.dept.id,
            sub_id: params.sub.id,
          });

          utilities.navigate("CategoryList", {
            cat: params.cat_id,
            department: params.dept,
            subDepartment: params.sub,
          });
        } else {
          throw result;
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideLoader());
        console.log(error);
        utilities.backendErrorMessage(error, "unable to get products!");
      })
      .finally(function() {});
  };
};
export const categoryProductsPaginated = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoaderShopCategory());
    fetch(
      `${utilities.BASE_URL}category/products?category_id=${
        params.cat_id
      }&offset=${params.offset}&limit=${params.limit}`,
      {
        method: "GET",
        headers: utilities.Interceptor.getHeaders(),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        dispatch(TASKS.hideLoaderShopCategory());

        if (result.status == true) {
          // if (params.currentCat) {
          //   dispatch({
          //     type: TYPES.SEARCHED_PRODUCTS,
          //     searchItems: result.data.products,
          //   });
          // }
          if (result.data.products.length) {
            dispatch({
              type: TYPES.GETCATEGORYPRODUCTS,
              categoryProducts: result.data.products,
              cat_id: params.cat_id,
              dept_id: params.dept.id,
              sub_id: params.sub.id,
            });
          }
        } else {
          throw result;
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideLoaderShopCategory());
        utilities.backendErrorMessage(error, "unable to get products!");
      })
      .finally(function() {});
  };
};

export const showLoaderShopCategory = () => {
  return (dispatch) => {
    dispatch({
      type: TYPES.SHOPLOADERSHOW,
    });
  };
};
export const hideLoaderShopCategory = () => {
  return (dispatch) => {
    dispatch({
      type: TYPES.SHOPLOADERHIDE,
    });
  };
};

export const advanceSearch = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoaderShopCategory());
    if (params.offset === 0) {
      dispatch({
        type: TYPES.CLEAR_ADVANCE_SEARCH_IETMS,
      });
    }
    fetch(
      `${utilities.BASE_URL}products/search-advance?term=${
        params.term
      }&country_code=${params.country_code}&offset=${params.offset}&limit=${
        params.limit
      }`,
      {
        method: "GET",
        headers: utilities.Interceptor.getHeaders(),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("search results", result);
        dispatch(TASKS.hideLoaderShopCategory());
        if (result.status) {
          console.log(result);
          dispatch({
            type: TYPES.ADVANCE_SEARCH_IETMS,
            _payload: result.data,
          });
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideLoaderShopCategory());
        console.log("advance search error", error);
      });
  };
};
