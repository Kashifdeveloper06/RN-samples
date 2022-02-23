import * as TYPES from "../../types";
import update from "immutability-helper";
import moment from "moment";

const initialState = {
  Coupons: [],
  CouponsDetails: null,
  ShopLoader: false,
  ShopProducts: [],
  ShopCatLoader: false,
};
const reducer = (state = initialState, actions) => {
  switch (actions.type) {
    case TYPES.FETCHED_SHOP_COUPONS:
      return {
        ...state,
        Coupons: actions.ShopCoupons,
      };
    case TYPES.SHOP_COUPON_DETAILS:
      return {
        ...state,
        CouponsDetails: actions.couponsDetails,
      };

    case TYPES.SHOW_SHOP_LOADER:
      return {
        ...state,
        ShopLoader: true,
      };
    case TYPES.HIDE_SHOP_LOADER:
      return {
        ...state,
        ShopLoader: false,
      };
    // case TYPES.ADVANCE_SEARCH_IETMS:
    //   console.log(actions._payload.categories);
    //   return {
    //     ...state,
    //     advanceSearchItems: {
    //       categories: [
    //         ...state.advanceSearchItems.categories,
    //         ...actions._payload.categories,
    //       ],
    //       products: [
    //         ...state.advanceSearchItems.products,
    //         ...actions._payload.products,
    //       ],
    //     },
    //   };
    // case TYPES.CLEAR_ADVANCE_SEARCH_IETMS:
    //   return {
    //     ...state,
    //     advanceSearchItems: {
    //       categories: [],
    //       products: [],
    //     },
    //   };
    case TYPES.SHOPLOADERSHOW:
      return {
        ...state,
        ShopCatLoader: true,
      };
    case TYPES.SHOPLOADERHIDE:
      return {
        ...state,
        ShopCatLoader: false,
      };
    default:
      return state;
  }
};
export default reducer;
