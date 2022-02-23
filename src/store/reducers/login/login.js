import * as TYPES from "../../types";

const initialState = {
  user: null,
  isGuestUser: false,
  image: "",
  country: "",
  defaultCountries: [],
  countryLocations: null,
  stores: null,
  onboarding: true,
  socialObj: null,
  fetchedNotifications: null,
  notificationsCount: null,
  customerCareInfo: null,
  redeemInfo: null,
  mlsStatus: true,
  cardPickupLocations: [],
  failedRegisteredEmail: null,
  isConnectCardRequest: false,
  mismatchCardInfo: null,
  OrderList: [],
  // specializations: []
};
const reducer = (state = initialState, actions) => {
  switch (actions.type) {
    case TYPES.ADD_USER:
      return {
        ...state,
        user: actions.user,
      };
    case TYPES.UPDATE_USER_POINTS:
      return {
        ...state,
        user: {
          ...actions.user,
          token: state.user.token,
        },
      };
    case TYPES.SET_USER_ACCESS_TOKEN:
      return {
        ...state,
        user: {
          ...state.user,
          token: actions.user_access_token,
        },
      };
    case TYPES.IS_GUEST_USER:
      return {
        ...state,
        isGuestUser: actions.isGuestUser,
      };
    case TYPES.ONBOARDING_OFF:
      return {
        ...state,
        onboarding: false,
      };
    case TYPES.STORE_REDEEM_INFO:
      return {
        ...state,
        redeemInfo: actions.redeemInfo,
      };
    case TYPES.FAILED_REGISTERED_EMAIL:
      return {
        ...state,
        failedRegisteredEmail: actions.failedRegisteredEmail,
      };
    case TYPES.SAVE_SOCIAL_OBJECT:
      return {
        ...state,
        socialObj: actions.payload.socialObj,
      };
    case TYPES.ADD_PICTURE:
      return {
        ...state,
        image: actions.picture,
      };

    case TYPES.ADD_USER_PICTURE:
      return {
        ...state,
        user: {
          ...state.user,
          user_info: {
            ...state.user.user_info,
            image: actions.image,
          },
        },
      };
    case TYPES.ADD_COUNTRY:
      return {
        ...state,
        country: actions.country,
      };
    case TYPES.DEFAULT_COUNTRIES:
      return {
        ...state,
        defaultCountries: actions.defaultCountries,
      };
    case TYPES.SAVE_STORES:
      return {
        ...state,
        stores: actions.stores,
      };
    case TYPES.SAVE_CUSTOMER_CARE_INFO:
      return {
        ...state,
        customerCareInfo: actions.customerCareInfo,
      };
    case TYPES.LOGOUT:
      return {
        ...state,
        user: actions.user,
      };
    case TYPES.FETCH_NOTIFICATIONS:
      return {
        ...state,
        fetchedNotifications: actions.fetchedNotifications,
      };
    case TYPES.GET_NOTIFICATIONS_COUNT:
      return {
        ...state,
        notificationsCount: actions.notificationsCount,
      };
    case TYPES.MLS_STATUS:
      return {
        ...state,
        mlsStatus: actions.mlsStatus,
      };
    case TYPES.UPDATE_USER_PROFILE:
      var newState = { ...state };
      if (actions.payload.table == "users") {
        newState.user[actions.payload.key] = actions.payload.value;
      } else {
        newState.user.user_info[actions.payload.key] = actions.payload.value;
        if (actions.payload.key == "country") {
          newState.user.is_connected = 0;
          newState.user.is_verified = 0;
          newState.user.clientcard = [];
        }
      }
      return newState;
    case TYPES.STORE_PICKUP_LOCATIONS:
      return {
        ...state,
        cardPickupLocations: actions.locations,
      };
    case TYPES.COUNTRY_LOCATION_STORED:
      return {
        ...state,
        countryLocations: actions.payload,
      };
    case TYPES.SET_EMBOSED_STATUS:
      var newState = { ...state };
      newState.user.clientcard.crd_em_status = actions.payload.crd_em_status;
      newState.user.clientcard.crd_pickup_location =
        actions.payload.crd_pickup_location;
      return newState;
    case TYPES.FETCHED_CARD_POINTS:
      var newState = { ...state };
      newState.user.clientcard.points = actions.points;
      return newState;

    case TYPES.IS_CONNECT_CARD_REQUEST:
      return {
        ...state,
        isConnectCardRequest: actions.isConnectCardRequest,
      };
    case TYPES.MISMATCH_CONNECT_CARD_INFO:
      return {
        ...state,
        mismatchCardInfo: actions.mismatchCardInfo,
      };
    case TYPES.FETCH_ORDER:
      var newState = { ...state };
      var _orders = actions.Orders;
      console.log("ORDERS in REDUCER", _orders);
      _orders.map((order, index) => {
        order.order.products.map((product, index2) => {
          product.checkoutPrice =
            parseFloat(product.quantity) *
            parseFloat(product.unit_retail.replace(/,/g, ""));
        });
      });

      newState.OrderList = _orders;
      return newState;
    // return {
    //   ...state,
    //   OrderList: actions.Orders,
    // };
    default:
      return state;
  }
};
export default reducer;
