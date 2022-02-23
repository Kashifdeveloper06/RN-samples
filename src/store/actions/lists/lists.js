import * as TASKS from "../index";
import * as utilities from "../../../utilities";
import * as TYPES from "../../types";

export const fetchLists = (type) => {
  let callType = typeof type !== "undefined" ? type : "normalCall";
  return (dispatch) => {
    if (callType === "normalCall") {
      dispatch(TASKS.showLoader());
    }
    fetch(`${utilities.BASE_URL}lists?user_id=`, {
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
            type: TYPES.FETCH_LISTS,
            fetchListing: result.data,
          });
          // utilities.navigate('Home')
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

export const getOrderStatus = (params) => {
  return (dispatch) => {
    fetch(`${utilities.BASE_URL}order-service-status`, {
      headers: utilities.Interceptor.getHeaders(),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          dispatch({
            type: TYPES.ORDER_DATA,
            data: result.data,
          });
        }
      })
      .catch((error) => {
        console.log("error");
      });
  };
};

export const addOrderProducts = (orderRequest) => {
  return (dispatch) => {
    dispatch({
      type: TYPES.ADD_ORDER_PRODUCTS,
      orderRequest: orderRequest,
    });
  };
};

export const removeOrderProduct = (productId) => {
  return (dispatch) => {
    dispatch({
      type: TYPES.REMOVE_ORDER_PRODUCT,
      productId: productId,
    });
  };
};
export const updateOrderDeliveryMethod = (method) => {
  return {
    type: TYPES.UPDATE_ORDER_DELIVERY_METHOD,
    method: method,
  };
};
export const updateOrderTotal = (total) => {
  // console.log(total)
  return {
    type: TYPES.UPDATE_ORDER_TOTAL,
    total: total,
  };
};
export const deleteOrderBundle = (index) => {
  return {
    type: TYPES.DELETE_ORDER_BUNDLE,
    index: index,
  };
};

export const updateOrderStoreId = (storeId) => {
  return {
    type: TYPES.UPDATE_ORDER_STORE_ID,
    store_id: storeId,
  };
};

export const updateOrderCardNumber = (cardNumber) => {
  return {
    type: TYPES.UPDATE_ORDER_CARD_NUMBER,
    number: cardNumber,
  };
};
export const updateOrderCurbsidePlateNumber = (plateNumber) => {
  return {
    type: TYPES.UPDATE_ORDER_CURBSIDE_PLATE_NUMBER,
    plateNumber: plateNumber,
  };
};

export const createOrder = (orderRequest) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    fetch(`${utilities.BASE_URL}order/create-advance`, {
      method: "POST",
      headers: utilities.Interceptor.getHeaders(),
      body: JSON.stringify(orderRequest),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("order-result", result);
        if (result.status) {
          // dispatch({
          //     type:TYPES.ADD_ORDER_PRODUCTS,
          //     orderRequest: []
          // })
          utilities.navigate("ThankYou", {
            orderNumber: result.data.order_number,
          });
        }
      })
      .catch((error) => {
        console.log("create order error", error);
      });
  };
};
export const setDeliveryCompany = (deliveryCompany) => {
  return {
    type: TYPES.SET_DELIVERY_COMPANY,
    deliveryCompany: deliveryCompany,
  };
};
export const checkProductsStock = (params) => {
  return (dispatch) => {
    fetch(
      `${utilities.BASE_URL}product/stock-info?product_id=${
        params.product_id
      }&store_id=${params.store_id}`,
      {
        method: "GET",
        headers: utilities.Interceptor.getHeaders(),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (result) {
          dispatch({
            type: TYPES.UPDATE_ORDER_PRODUCTS,
            orderProduct: result.data,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
};

export const fetchListItems = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    // dispatch(TASKS.showListItemsLoader());
    fetch(
      `${utilities.BASE_URL}lists/items-and-bundles?list_id=${params.list_id}`,
      {
        headers: utilities.Interceptor.getHeaders(),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("LIST ITEMS", result);
        if (result.status == true) {
          dispatch({
            type: TYPES.FETCH_LIST_ITEMS,
            fetchedListItems: result.data,
          });
        } else {
          throw result;
        }
        dispatch(TASKS.hideLoader());
        // dispatch(TASKS.hideListItemsLoader());
      })
      .catch((error) => {
        dispatch(TASKS.hideLoader());
        // dispatch(TASKS.hideListItemsLoader());
        console.log("error", error);
        //utilities.backendErrorMessage(error, "Something Went Wrong !");
      });
  };
};

export const getProductStockInfo = (productId) => {
  return (dispatch) => {
    // dispatch(TASKS.showLoader())
    dispatch({
      type: TYPES.PRODUCT_STOCK_INFO,
      productStockInfo: null,
    });
    fetch(`${utilities.BASE_URL}product/detail?id=${productId}`, {
      headers: utilities.Interceptor.getHeaders(),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          console.log("stock data", result);
          dispatch({
            type: TYPES.PRODUCT_STOCK_INFO,
            productStockInfo: result.data,
          });
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideLoader());
      });
  };
};
export const addNewObjectListBackend = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    fetch(`${utilities.BASE_URL}lists/create`, {
      method: "POST",
      headers: utilities.Interceptor.getHeaders(),
      body: JSON.stringify({
        name: params.name,
        user_id: params.user_id,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        dispatch(TASKS.hideLoader());
        if (result.status) {
          dispatch({
            type: TYPES.ADD_OBJECT_LIST,
            newObject: result.data[0],
          });
          dispatch({
            type: TYPES.ACTIVELIST,
            list_id: result.data[0].id,
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
export const searchListItems = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    if (params.term == "") {
      dispatch({
        type: TYPES.SEARCHED_PRODUCTS,
        searchItems: [],
      });
      dispatch(TASKS.hideLoader());
    } else {
      fetch(
        `${utilities.BASE_URL}lists/products/search?term=${
          params.term
        }&list_id=${params.list_id}&country_code=${params.country_code}`,
        {
          method: "GET",
          headers: utilities.Interceptor.getHeaders(),
        }
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.status == true) {
            dispatch({
              type: TYPES.SEARCHED_PRODUCTS,
              searchItems: [],
            });
            dispatch({
              type: TYPES.SEARCHED_PRODUCTS,
              searchItems: result.data.products,
            });

            dispatch(TASKS.hideLoader());
          } else {
            throw result;
          }
        })
        .catch((error) => {
          dispatch(TASKS.hideLoader());
          utilities.backendErrorMessage(error, "Please Search Again!");
        })
        .finally(function() {
          console.log("aaaaaaaa");
        });
    }
  };
};

export const clearSearchItems = (params) => {
  return {
    type: TYPES.SEARCHED_PRODUCTS,
    searchItems: [],
  };
};
export const addListItem = (params) => {
  return (dispatch) => {
    //dispatch(TASKS.showLoader());
    fetch(`${utilities.BASE_URL}lists/items`, {
      method: "POST",
      headers: utilities.Interceptor.getHeaders(),
      body: JSON.stringify({
        list_id: params.list_id,
        product_id: params.product_id,
        product_quantity: params.product_quantity,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        dispatch(TASKS.hideLoader());
        if (result.status == true) {
          // dispatch(storeUser(result.data));
          // dispatch({
          //     type: TYPES.ADD_OBJECT_LIST,
          //     newObject: params
          //   })
          // utilities.navigate('Home')
          //dispatch(fetchLists())
        } else {
          throw result;
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideLoader());
        //utilities.backendErrorMessage(error, "Something Went Wrong !");
      });
  };
};
export const deleteListItem = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    fetch(`${utilities.BASE_URL}lists/items/remove`, {
      method: "POST",
      headers: utilities.Interceptor.getHeaders(),
      body: JSON.stringify({
        list_id: params.list_id,
        product_id: params.product_id,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        dispatch(TASKS.hideLoader());
        if (result.status == true) {
          // dispatch(storeUser(result.data));
          // dispatch({
          //     type: TYPES.ADD_OBJECT_LIST,
          //     newObject: params
          //   })
          // utilities.navigate('Home')
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
export const toggleListItem = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    fetch(`${utilities.BASE_URL}lists/items/update`, {
      method: "POST",
      headers: utilities.Interceptor.getHeaders(),
      body: JSON.stringify({
        list_id: params.list_id,
        product_id: params.product_id,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        dispatch(TASKS.hideLoader());
        if (result.status == true) {
          // dispatch(storeUser(result.data));
          // dispatch({
          //     type: TYPES.ADD_OBJECT_LIST,
          //     newObject: params
          //   })
          // utilities.navigate('Home')
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
export const deleteNewObjectListBackend = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    fetch(`${utilities.BASE_URL}lists/delete`, {
      method: "POST",
      headers: utilities.Interceptor.getHeaders(),
      body: JSON.stringify({
        list_id: params.list_id,
        user_id: params.user_id,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        //console.log("[lists.js] watching api response lists delete",result)
        dispatch(TASKS.hideLoader());
        if (result.status == true) {
          // dispatch(storeUser(result.data));
          // dispatch({
          //     type: TYPES.ADD_OBJECT_LIST,
          //     newObject: params
          //   })
          // utilities.navigate('Home')
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
export const editNewObjectListBackend = (params) => {
  //console.log("editer params here",params)
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    fetch(`${utilities.BASE_URL}lists/update`, {
      method: "POST",
      headers: utilities.Interceptor.getHeaders(),
      body: JSON.stringify({
        list_id: params.list_id,
        user_id: params.user_id,
        name: params.name,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        //console.log("[lists.js] watching api response lists update",result)
        dispatch(TASKS.hideLoader());
        if (result.status == true) {
          // dispatch(storeUser(result.data));
          // dispatch({
          //     type: TYPES.ADD_OBJECT_LIST,
          //     newObject: params
          //   })
          // utilities.navigate('Home')
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

export const GetDepartments = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showCategoriesLoader());
    fetch(`${utilities.BASE_URL}departments?country_code=${params}`, {
      method: "GET",
      headers: utilities.Interceptor.getHeaders(),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Departments result....", result);
        if (result.status) {
          dispatch({
            type: TYPES.GETDEPARTMENTS,
            data: result.data.departments,
          });
          dispatch(TASKS.hideCategoriesLoader());
        } else {
          throw result;
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideCategoriesLoader());
        utilities.backendErrorMessage(error, "error fetching categories!");
      });
  };
};
export const getCategories = (id, dept_id, country_code) => {
  console.log("Sub ID", id);
  console.log("Dep ID", dept_id);
  console.log("Country", country_code);
  return (dispatch) => {
    dispatch(TASKS.showCategoriesLoader());
    fetch(
      `${
        utilities.BASE_URL
      }categories/subdepartment?sub_department_id=${id}&country_code=${country_code}`,
      {
        method: "GET",
        headers: utilities.Interceptor.getHeaders(),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("getCategories result => ", result);

        if (result.status == true) {
          // let _catProdCount
          // result.data.categories.map((cat)=>{
          //   let _prodCount = 0
          //   cat.products.map((prodcut)=>{
          //     _prodCount += _prodCount + 1
          //   })
          //   let _p = {
          //     category: cat.name,
          //     product_count: _prodCount
          //   }
          //   _catProdCount.push(_p)
          // })
          // console.log('CATEGORYPRODUCTS', _catProdCount)
          dispatch({
            type: TYPES.GETCATEGORIES,
            sub_id: id,
            dept_id: dept_id.id,
            data: result.data.categories,
          });
          dispatch(TASKS.hideCategoriesLoader());
        } else {
          // throw result;
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideCategoriesLoader());
        console.log("errrrror", error);
        // utilities.backendErrorMessage(error, "error fetching categories!");
      });
  };
};

export const clearSubdepartmentCategories = (subId, depId) => {
  return (dispatch) => {
    dispatch({
      type: TYPES.CLEAR_SUBDEPARTMENT_CATEGORIES,
      payload: { subId: subId, deptId: depId },
    });
  };
};

export const ShopSearch = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    if (params.term == "") {
      dispatch({
        type: TYPES.SEARCHED_PRODUCTS,
        searchItems: [],
      });
      dispatch(TASKS.hideLoader());
    } else {
      fetch(
        `${utilities.BASE_URL}lists/products/search?term=${
          params.term
        }&category_id=${params.categoryID}&country_code=${params.country_code}`,
        {
          method: "GET",
          headers: utilities.Interceptor.getHeaders(),
        }
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.status == true) {
            dispatch({
              type: TYPES.SEARCHED_PRODUCTS,
              searchItems: result.data.products,
            });

            dispatch(TASKS.hideLoader());
          } else {
            throw result;
          }
        })
        .catch((error) => {
          dispatch(TASKS.hideLoader());
          utilities.backendErrorMessage(error, "Please Search Again!");
        })
        .finally(function() {
          console.log("aaaaaaaa");
        });
    }
  };
};

export const ShopaddListItem = (params) => {
  return (dispatch) => {
    //dispatch(TASKS.showLoader());
    fetch(`${utilities.BASE_URL}lists/items`, {
      method: "POST",
      headers: utilities.Interceptor.getHeaders(),
      body: JSON.stringify({
        list_id: params.list_id,
        product_id: params.product_id,
        product_quantity: params.product_quantity,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        dispatch(TASKS.hideLoader());
        if (result.status == true) {
          utilities.showToast("Product added!");
          dispatch(fetchLists("silentCall"));
          // dispatch({
          //   type: TYPES.SHOPITEMS,
          //   product: params.product_id,
          //   Listid: params.list_id,
          // });
        } else {
          throw result;
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideLoader());
        //utilities.backendErrorMessage(error, "Something Went Wrong !");
      });
  };
};

export const setActiveList = (id) => {
  return (dispatch) => {
    dispatch({
      type: TYPES.ACTIVELIST,
      list_id: id,
    });
  };
};
export const categoryProducts = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());

    fetch(
      `${utilities.BASE_URL}category/products?category_id=${
        params.category_id
      }`,
      {
        method: "GET",
        headers: utilities.Interceptor.getHeaders(),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status == true) {
          if (params.currentCat) {
            dispatch({
              type: TYPES.SEARCHED_PRODUCTS,
              searchItems: result.data.products,
            });
          }
          dispatch({
            type: TYPES.GETCATEGORYPRODUCTS,
            categoryProducts: result.data.products,
            cat_id: params.category_id,
            dept_id: params.department_id,
            sub_id: params.sub_department,
          });

          dispatch(TASKS.hideLoader());
        } else {
          throw result;
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideLoader());
        utilities.backendErrorMessage(error, "unable to get products!");
      })
      .finally(function() {});
  };
};

export const advanceSearch = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    dispatch({
      type: TYPES.ADVANCE_SEARCH_IETMS,
      _payload: { categories: [], products: [] },
    });
    fetch(
      `${utilities.BASE_URL}products/search-advance?term=${
        params.term
      }&country_code=${params.country_code}`,
      {
        method: "GET",
        headers: utilities.Interceptor.getHeaders(),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("search results", result);
        dispatch(TASKS.hideLoader());
        if (result.status) {
          dispatch({
            type: TYPES.ADVANCE_SEARCH_IETMS,
            _payload: result.data,
          });
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideLoader());
        console.log("advance search error", error);
      });
  };
};
export const addListBundle = (params) => {
  console.log(params);
  return (dispatch) => {
    fetch(`${utilities.BASE_URL}lists/bundles`, {
      method: "POST",
      headers: utilities.Interceptor.getHeaders(),
      body: JSON.stringify({
        list_id: params.list_id,
        coupon_id: params.bundleData.coupon_id,
        list_coupon_id: params.bundleData.list_coupon_id,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("list add result", result);

        if (result.status == true) {
          let _coupon_list_id = result.data.coupon_list_id;
          if (params.bundleData.products && params.bundleData.products.length) {
            fetch(`${utilities.BASE_URL}lists/bundles/mix-and-match/products`, {
              method: "POST",
              headers: utilities.Interceptor.getHeaders(),
              body: JSON.stringify({
                coupon_list_id: _coupon_list_id,
                products: params.bundleData.products,
              }),
            })
              .then((response) => response.json())
              .then((callResult) => {
                console.log("list add result", callResult);
                if (callResult.status) {
                  utilities.showToast("Products added!");
                  console.log(
                    "bundle products add response code",
                    callResult.code
                  );
                }
              })
              .catch((error) => {});
          } else {
            utilities.showToast("Products added!");
          }
        } else {
          throw result;
        }
      })
      .catch((error) => {
        dispatch(TASKS.hideLoader());
        //utilities.backendErrorMessage(error, "Something Went Wrong !");
      });
  };
};

export const deleteListBundle = (params) => {
  return (dispatch) => {
    dispatch(TASKS.showLoader());
    fetch(`${utilities.BASE_URL}lists/bundles/remove`, {
      method: "POST",
      headers: utilities.Interceptor.getHeaders(),
      body: JSON.stringify({
        list_id: params.list_id,
        coupon_id: params.coupon_id,
        list_coupon_id: params.list_coupon_id,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        dispatch(TASKS.hideLoader());
        if (result.status == true) {
          console.log("delete bundle result", result);
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

export const UpdateBundle = (params) => {
  return (dispatch) => {
    fetch(`${utilities.BASE_URL}lists/bundles/mix-and-match/products`, {
      method: "POST",
      headers: utilities.Interceptor.getHeaders(),
      body: JSON.stringify({
        coupon_list_id: params.bundleData.list_coupon_id,
        products: params.bundleData.products,
      }),
    })
      .then((response) => response.json())
      .then((callResult) => {
        console.log("list add result", callResult);
        if (callResult.status) {
          utilities.showToast("Products updated!");

          console.log("bundle products add response code", callResult.code);
        }
      })
      .catch((error) => {});
  };
};
