import * as TYPES from "../../types";
const initialState = {
  fetchedLists: { checked: [], unchecked: [] },
  fetchedListItems: [],
  searchItems: [],
  orderProducts: [],
  orderRequest: [],
  orderData: { order_service_status: true },
  productStockInfo: null,
  deliveryCompany: null,
  departments: [],
  advanceSearchItems: { categories: [], products: [] },
  activeList: null,
};
const reducer = (state = initialState, actions) => {
  switch (actions.type) {
    case TYPES.FETCH_LISTS:
      return {
        ...state,
        fetchedLists: actions.fetchListing,
      };
    case TYPES.FETCH_LIST_ITEMS:
      return {
        ...state,
        fetchedListItems: actions.fetchedListItems,
      };
    case TYPES.SEARCHED_PRODUCTS:
      return {
        ...state,
        searchItems: actions.searchItems,
      };
    case TYPES.ADVANCE_SEARCH_IETMS:
      return {
        ...state,
        advanceSearchItems: actions._payload,
      };
    case TYPES.ADD_OBJECT_LIST:
      // let newobj = state.fetchedLists.push(actions.newObject)
      return {
        ...state,
        fetchedLists: [actions.newObject, ...state.fetchedLists],
      };
    case TYPES.DELETE_OBJECT_LIST:
      const newTaskArray = state.fetchedLists.filter(
        (listObject) => listObject.id !== actions.id
      );
      return {
        ...state,
        fetchedLists: newTaskArray,
      };
    case TYPES.ORDER_DATA:
      return {
        ...state,
        orderData: actions.data,
      };
    case TYPES.ADD_ORDER_PRODUCTS:
      return {
        ...state,
        orderRequest: actions.orderRequest,
      };
    case TYPES.UPDATE_ORDER_PRODUCTS:
      var newState = { ...state };
      newState.orderRequest.products.map((product, index) => {
        if (actions.orderProduct.product_id == product.id) {
          newState.orderRequest.products[index].stockQuantity =
            actions.orderProduct.quantity;
          //newState.orderRequest.products[index].quantity = '0'
          return newState;
        }
      });

    case TYPES.REMOVE_ORDER_PRODUCT:
      var newState = { ...state };
      let _index = -1;
      newState.orderRequest.products.map((product, index) => {
        if (product.id == actions.productId) {
          console.log("done", actions.productId);
          _index = index;
          newState.orderRequest.products.splice(_index, 1);
        }
      });
      // console.log('state products', newState.orderRequest.products)
      return newState;

    case TYPES.SET_DELIVERY_COMPANY:
      return {
        ...state,
        deliveryCompany: actions.deliveryCompany,
      };

    case TYPES.UPDATE_ORDER_TOTAL:
      var newState = { ...state };
      newState.orderRequest.total_price = actions.total;
      return newState;
    case TYPES.UPDATE_ORDER_DELIVERY_METHOD:
      var newState = { ...state };
      newState.orderRequest.delivery_details.delivery_method = actions.method;
      return newState;
    case TYPES.UPDATE_ORDER_STORE_ID:
      var newState = { ...state };
      newState.orderRequest.delivery_details.store_id = actions.store_id;
      return newState;
    case TYPES.UPDATE_ORDER_CARD_NUMBER:
      var newState = { ...state };
      newState.orderRequest.card_number = actions.number;
      return newState;
    case TYPES.UPDATE_ORDER_CURBSIDE_PLATE_NUMBER:
      var newState = { ...state };
      newState.orderRequest.delivery_details.license_plate_number =
        actions.plateNumber;
    case TYPES.PRODUCT_STOCK_INFO:
      return {
        ...state,
        productStockInfo: actions.productStockInfo,
      };

    case TYPES.DELETE_ORDER_BUNDLE:
      var newState = { ...state };
      // console.log('OrderData', actions.index)
      newState.orderRequest.bundles.splice(actions.index, 1);
      // newState.orderData.bundles.map((bundle, index) => {
      //     if (index === actions.index) {
      //       newState.orderRequest.bundles.splice(index,1)
      //     }
      // })
      return newState;

    case TYPES.GETDEPARTMENTS:
      return {
        ...state,
        departments: actions.data,
      };

    case TYPES.GETCATEGORIES:
      return {
        ...state,
        departments: state.departments.map((dept) => {
          if (dept.id === actions.dept_id) {
            dept.sub_departments.map((sub) => {
              if (sub.id === actions.sub_id) {
                return {
                  ...sub,
                  ...(sub.categories = actions.data),
                };
              }
              return sub;
            });
          }
          return dept;
        }),
      };

    case TYPES.CLEAR_SUBDEPARTMENT_CATEGORIES:
      return {
        ...state,
        departments: state.departments.map((dept) => {
          if (dept.id === actions.payload.deptId) {
            dept.sub_departments.map((sub) => {
              if (sub.id === actions.payload.subId) {
                return {
                  ...sub,
                  ...(sub.categories = []),
                };
              }
              return sub;
            });
          }
          return dept;
        }),
      };
    case TYPES.GETCATEGORYPRODUCTS:
      return {
        ...state,
        departments: state.departments.map((dept) => {
          if (dept.id === actions.dept_id) {
            dept.sub_departments.map((sub) => {
              if (sub.id === actions.sub_id) {
                sub.categories.map((category) => {
                  if (category.id === actions.cat_id) {
                    !category.products && (category.products = []);
                    return {
                      ...category,
                      ...(category.products = [
                        ...category.products,
                        ...actions.categoryProducts,
                      ]),
                    };
                  }
                });
              }
              return sub;
            });
          }
          return dept;
        }),
      };
    case TYPES.ACTIVELIST:
      return {
        ...state,
        activeList: actions.list_id,
      };

    default:
      return state;
  }
};
export default reducer;
