import React, { Component } from "react";
import {
  Alert,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
} from "react-native";
import { styles } from "../../styles";
import { connect } from "react-redux";
import * as util from "../../utilities";
import Modal from "react-native-modal";
import * as TASKS from "../../store/actions";
import FastImage from "react-native-fast-image";
import ProductStockInfoModal from "../shared/product/StockInfo";
import { NavigationActions, StackActions } from "react-navigation";
import analytics from "@react-native-firebase/analytics";
import { Card } from "react-native-elements";
import moment from "moment";
class ShopNow extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <Image
        style={styles.parentHeaderLogo}
        resizeMode="contain"
        source={require("../../../assets/clientLogo.png")}
      />
    ),
    // tabBarVisible:false
    // tabBarVisible: false
    // tabBar:{visible:false}
  });

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      departments: this.props.departments ? this.props.departments : [],
      department_id: false,
      category_id: false,
      sub_department_id: false,
      bottomDrop: false,
      searchData: [],
      localSearch: false,
      productObj: null,
      stockInfoModalIsVisible: false,
      overlayId: null,
      activeList: null,
      searchInFocus: false,
      addListModal: false,
      isSearchCatClick: false,
      currentUserCountry: null,
      searchCat: null,
      indexTabReceiverCheck: 0,
      searchItems: [],
    };
    this.screenanalytics();
  }

  async screenanalytics() {
    await analytics().logScreenView({ screen_name: "ShopScreen" });
  }

  componentDidMount() {
    console.log("Departments", this.state.departments);
    if (this.props.user) {
      this.props.fetchLists();
      this.props.getOrderStatus();
      this.props.getDepartments(this.props.user.user_info.country);
      this.willFocusListener = this.props.navigation.addListener(
        "willFocus",
        () => {
          if (
            this.state.currentUserCountry !== this.props.user.user_info.country
          ) {
            this.setState({
              currentUserCountry: this.props.user.user_info.country,
            });
            this.props.getOrderStatus();
            this.props.getDepartments(this.props.user.user_info.country);
          }
          let _tab = this.props.navigation
            .dangerouslyGetParent()
            .getParam("tab");
          if (_tab == "list-details") {
            this.setState({ indexTabReceiverCheck: 1 });

            this.SearchInput.focus();
          } else {
            this.setState({ indexTabReceiverCheck: 0 });

            this.SearchInput.blur();
          }

          if (
            this.props.navigation.state?.params?.ScreenrouteName ==
            "shopBundleScreen"
          ) {
            // console.log("aaaaa gya wapis");
            setTimeout(
              () => {
                this.setState({ promotionModal: true }, () => {
                  this.props.navigation.setParams({ ScreenrouteName: "" });
                });
              },
              Platform.OS === "ios" ? 200 : 0
            );
          }
        }
      );

      this.setState({
        activeList: this.props.activeList ? this.props.activeList : null,
      });
    }
  }
  componentWillUnmount() {
    if (this.willFocusListner) {
      this.willFocusListner.remove();
    }
  }

  handleDeptClick = (id) => {
    if (this.state.department_id === id) {
      if (this.state.category_id) {
        // this.props.clearSubdepartmentCategories(this.state.category_id, id)
      }
      this.setState({ department_id: false, category_id: null });
    } else {
      if (this.state.category_id && this.state.department_id) {
        // this.props.clearSubdepartmentCategories(this.state.category_id, this.state.department_id)
      }
      this.setState({ department_id: id });
    }
  };
  handleSubDepartmentClick = (subdepartment, dept) => {
    let _category_id = this.state.category_id;
    if (subdepartment.id === _category_id) {
      this.setState({ category_id: null });
      // this.props.clearSubdepartmentCategories(subdepartment.id, dept.id)
    } else {
      this.setState({ category_id: subdepartment.id });
      if (_category_id) {
        // this.props.clearSubdepartmentCategories(_category_id, dept.id)
      }
      console.log("Dept", dept);
      console.log("Sub", subdepartment);
      this.props.getCategories(
        subdepartment.id,
        dept,
        this.props.user.user_info.country
      );
    }
  };
  handleCatClick = (category, dept, sub) => {
    // this.props.departments.map((dept) => {

    // })

    this.props.navigation.navigate("CategoryList", {
      cat: category,
      department: dept,
      subDepartment: sub,
      returnData: this.returnData,
    });
    analytics().logEvent("Categories", {
      category: category.name,
      country_code: this.props.user.user_info.country,
    });
  };

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   if (nextProps !== this.state.departments) {
  //     console.log('deptssssss', nextProps.departments)
  //     this.setState({
  //       departments: nextProps.departments,
  //     });
  //   }
  // }

  componentDidUpdate(prevProps, prevState) {
    if (
      !this.props.isLoadingListItems &&
      this.props.isLoadingListItems !== prevProps.isLoadingListItems
    ) {
      if (this.props.fetchedListItems) {
        this.setState({ fetchedListItems: this.props.fetchedListItems }, () => {
          console.log("fetchedListItems", this.state.fetchedListItems);
          this.goToCheckout();
        });
      }
    }
    if (
      !this.props.isLoadingCategories &&
      this.props.isLoadingCategories !== prevProps.isLoadingCategories
    ) {
      // console.log('--------')
      // console.log(this.state.searchCat, this.state.isSearchCatClick)
      // console.log('--------')
      console.log("after getting categories", this.state.departments);
      this.setState({ departments: this.props.departments });
      // if (this.state.isSearchCatClick) {
      //   console.log('dfadfasfasfdasdfasfsafsafsafsafsaf')
      //   this.setState({isSearchCatClick:false})
      //   let _department = null
      //   let _sub = null
      //   this.props.departments.map((dept) => {
      //     if (cat.department_id === dept.id) {
      //       _department = dept
      //       _department.sub_departments.map((sub) => {
      //         if (sub.id === cat.sub_department_id) {

      //           _sub = sub
      //           // this.handleSubDepartmentClick(_sub, _department)
      //           // this.props.getCategories(_sub.id, _department, this.props.user.user_info.country);
      //           // setTimeout(() => {
      //             this.handleCatClick(this.state.searchCat,_department,_sub)
      //           // },500)
      //         }
      //       })
      //     }
      //   })
      // }
    }
    if (
      JSON.stringify(prevProps.advanceSearchItems) !==
      JSON.stringify(this.props.advanceSearchItems)
    ) {
      let _products = [];

      this.props.advanceSearchItems.products.map((item) => {
        let _item = item;
        if (_item.is_scalable && !_item.size.includes("CT")) {
          let _measureUnit = _item.size;
          let _price = null;
          let _regular_retail = null;
          if (_measureUnit === "KG" || _measureUnit.includes("KG")) {
            _price = parseFloat(_item.unit_retail / 2.20462).toFixed(2);
            _regular_retail = parseFloat(
              _item.regular_retail / 2.20462
            ).toFixed(2);
          }
          if (_measureUnit === "G") {
            _price = parseFloat(_item.unit_retail / 453.59237).toFixed(2);
            _regular_retail = parseFloat(
              _item.regular_retail / 453.59237
            ).toFixed(2);
          }
          if (_measureUnit.includes("OZ")) {
            _price = parseFloat(_item.unit_retail / 16).toFixed(2);
            _regular_retail = parseFloat(_item.regular_retail / 16).toFixed(2);
          }
          _item.size = "lb";
          _item.unit_retail = _price;
          _item.regular_retail = _regular_retail;
          if (this.props.fetchedLists) {
            this.props.fetchedLists.map((list) => {
              if (list.id == this.state.activeList) {
                if (list.products?.length > 0) {
                  list.products?.map((product) => {
                    if (_item.id == product.id) {
                      console.log("list products", product, _item);
                      return (_item.quantity = parseFloat(
                        product.pivot.product_quantity
                      ));
                    } else {
                      return (_item.quantity = 0.25);
                    }
                  });
                } else {
                  _item.quantity = 0.25;
                }
              } else {
                _item.quantity = 0.25;
              }
            });
          } else {
            _item.quantity = 0.25;
          }
        } else {
          _item.quantity = 1;
        }

        _products.push(_item);
      });
      this.setState({searchItems: _products}, () => {
        console.log(this.state.searchItems)
        this.FilterbyDiscount()
      });

      this.props.advanceSearchItems.categories.map((cat) => {
        let _department = null;
        let _sub = null;
        this.props.departments.map((dept) => {
          if (cat.department_id === dept.id) {
            _department = dept;
            _department.sub_departments.map((sub) => {
              if (sub.id === cat.sub_department_id) {
                _sub = sub;

                // this.handleSubDepartmentClick(_sub, _department)
                this.props.getCategories(
                  _sub.id,
                  _department,
                  this.props.user.user_info.country
                );
                // setTimeout(() => {
                //   this.handleCatClick(cat,_department,_sub)
                // },500)
              }
            });
          }
        });
      });
    }
    if (
      prevState.activeList !== this.state.activeList &&
      this.state.activeList
    ) {
      if (this.state.searchItems) {
        const _searchItems = [...this.state.searchItems];
        this.props.fetchedLists.map((list) => {
          if (list.id === this.state.activeList) {
            _searchItems.map((item, index) => {
              let _item = item;
              list.products?.map((product) => {
                if (item.id == product.id) {
                  console.log("products here", product);
                  _searchItems[index].quantity = product.pivot.product_quantity;
                }
              });
            });
          }
        });
        console.log("search items here", _searchItems);
        this.setState({ searchItems: _searchItems });
        Keyboard.dismiss();
      }
    }
    if (
      this.props.activeList !== prevProps.activeList &&
      this.props.activeList
    ) {
      this.handleAddToList(this.props.activeList);
    }
  }
  askForRegister() {
    Alert.alert(
      "Authentication Required",
      "Please login or register to use this feature!",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Login",
          onPress: () => this.props.navigation.navigate("Login"),
        },
      ],
      { cancelable: false }
    );
  }

  triggerSearch = () => {
    this.setState({
      activeBtn: false,
      sortbyPriceAscending: false,
      discountFilter: false,
    });
    if (this.props.user && this.state.searchTerm.length > 2) {
      this.setState({ localSearch: true });
      let _payload = {
        term: this.state.searchTerm,
        country_code: this.props.user.user_info.country,
      };
      this.props.advanceSearch(_payload);
      Keyboard.dismiss();
      analytics().logEvent("searchTerms", {
        term: this.state.searchTerm,
        country_code: this.props.user.user_info.country,
      });
    }
  };

  cancelSearch = () => {
    Keyboard.dismiss();
    this.setState({
      localSearch: false,
      searchInFocus: false,
      searchTerm: null,
      indexTabReceiverCheck: 0,
      activeBtn: false,
      sortbyPriceAscending: false,
      discountFilter: false,
    });
    const setParamsAction = NavigationActions.setParams({
      params: { tab: "no" },
      key: "Shop",
    });
    this.props.navigation.dispatch(setParamsAction);
  };
  returnData = (term) => {
    if (term.length) {
      this.SearchInput.focus();
      this.setState({ searchTerm: term }, () => {
        this.triggerSearch();
      });
    }
  };
  handleCatClick = (category, dept, sub) => {
    // this.props.departments.map((dept) => {

    // })

    this.props.navigation.navigate("CategoryList", {
      cat: category,
      department: dept,
      subDepartment: sub,
      returnData: this.returnData,
    });
    analytics().logEvent("Categories", {
      category: category.name,
      country_code: this.props.user.user_info.country,
    });
  };
  handleSearchCatClick = (cat) => {
    if (cat) {
      // this.setState({searchCat:cat,isSearchCatClick:true})
      let _department = null;
      let _sub = null;
      this.props?.departments?.map((dept) => {
        if (cat.department_id === dept.id) {
          _department = dept;
          _department?.sub_departments.map((sub) => {
            if (sub.id === cat.sub_department_id) {
              sub?.categories?.map((category) => {
                if (cat.id === category.id) {
                  this.handleCatClick(category, _department, sub);
                }
              });
            }
          });
        }
      });
    }
  };
  handleProductPress = (product) => {
    this.setState({
      productID: product.id,
      stockInfoModalIsVisible: true,
      stockProduct: product,
    });
  };
  closeStockModal = (isVisible) => {
    this.setState({
      stockInfoModalIsVisible: !this.state.stockInfoModalIsVisible,
    });
  };
  openproductOverlay = () => {
    this.setState({ overlayId: this.state.productID });
    this.setState({
      stockInfoModalIsVisible: !this.state.stockInfoModalIsVisible,
    });
  };
  decreseQuantity = (id, index) => {
    //const data = [...this.state.searchItems]
    console.log('prd ID', this.state.searchItems)
    console.log('prd Index',index)
    let prods = [...this.state.searchItems];
    // console.log(prods)
    let _prod = {...prods[index]}
    console.log('this is the product', _prod)
    if (_prod.is_scalable) {
              _prod.quantity =
              _prod.quantity > 0.25 ? +_prod.quantity - 0.25 : _prod.quantity;
    }else{
       _prod.quantity > 1 ? _prod.quantity-- : _prod.quantity;
    }
    prods[index] = _prod
    // const prods = { ...this.state.searchItems };
    // var resultArray = Object.keys(prods).map(function(prodsIndex) {
    //   let _prod = prods[prodsIndex];
    //   if (_prod.id === id) {
    //     if (_prod.quantity > 0) {
    //       if (_prod.is_scalable) {
    //         _prod.quantity =
    //           _prod.quantity > 0.25 ? +_prod.quantity - 0.25 : _prod.quantity;
    //       } else {
    //         _prod.quantity > 1 ? _prod.quantity-- : _prod.quantity;
    //       }
    //     }
    //   }
    //   return _prod;
    // });

    this.setState({ searchItems: prods });
  };
  increseQuantity = (id, index) => {
    console.log('prd ID', this.state.searchItems)
    console.log('prd Index',index)
    let prods = [...this.state.searchItems];
    // console.log(prods)
    let _prod = {...prods[index]}
    console.log('this is the product', _prod)
    if (_prod.is_scalable) {
      _prod.quantity = +_prod.quantity + 0.25;
    }else{
      _prod.quantity++;
    }
    prods[index] = _prod

    // var resultArray = Object.keys(prods).map(function(prodsIndex) {
    //   let _prod = prods[prodsIndex];
    //   if (_prod.id === id) {
    //     console.log('this is the product',_prod)
    //     if (_prod.is_scalable) {
    //       console.log('item is scalable')
    //       _prod.quantity = +_prod.quantity + 0.25;
    //     } else {
    //       console.log('item is NOT scalable')
    //       _prod.quantity++;
    //     }
    //   }
    //   return _prod;
    // });

    this.setState({ searchItems: prods });
  };

  addProductToList = (product) => {
    this.setState({ productObj: product });
    if (this.state.activeList) {
      let data = {
        list_id: this.state.activeList,
        product_id: product.id,
        product_quantity: product.quantity.toString(),
      };
      this.props.ShopaddListItem(data);

      this.setState({ productObj: null, overlayId: null });
    } else {
      this.setState({ bottomDrop: true });
    }
  };
  handleAddToList = (list_id) => {
    this.setState({ activeList: list_id });
    if (this.state.productObj) {
      let data = {
        list_id: list_id,
        product_id: this.state.productObj.id,
        product_quantity: this.state.productObj.quantity.toString(),
      };
      this.props.ShopaddListItem(data);
      this.setState({ productObj: null });
    }
    this.setState({
      bottomDrop: false,
      overlayId: null,
    });
  };

  renderOverlay = (rowData, index) => {
    
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          marginBottom: util.WP(1.8),
          paddingHorizontal: util.WP(6.3),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: util.WP(3.6),
                fontFamily: "Montserrat-Light",
                borderBottomColor: "#aaaaaa",
                borderBottomWidth: 1,
                paddingBottom: util.WP(2),
              }}
            >
              Quantity:
              <Text
                style={{
                  fontFamily: "Montserrat-Bold",
                }}
              >
                {rowData.quantity}
              </Text>
              {rowData.is_scalable ? (
                <Text
                  style={{
                    fontFamily: "Montserrat-Medium",
                    marginLeft: 3,
                  }}
                >
                  {rowData.size}
                </Text>
              ) : null}
            </Text>

            <Text
              style={{
                fontSize: util.WP(3.6),
                fontFamily: "Montserrat-Light",
                borderBottomColor: "#aaaaaa",
                borderBottomWidth: 1,
                paddingBottom: util.WP(2),
                marginLeft: util.WP(3),
              }}
            >
              Price:{" "}
              <Text
                style={{
                  fontFamily: "Montserrat-Bold",
                }}
              >
                ${parseFloat(rowData.quantity * rowData.unit_retail).toFixed(2)}
              </Text>
            </Text>
          </View>
          <View style={{ paddingBottom: util.WP(2) }}>
            <TouchableOpacity
              onPress={() => this.setState({ overlayId: null })}
            >
              <Image
                source={require("../../../assets/close.png")}
                style={{
                  width: util.WP(7),
                  height: util.WP(7),
                  resizeMode: "contain",
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            // justifyContent: 'space-between',
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              //marginTop: util.WP(2),
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => this.decreseQuantity(rowData.id, index)}
            >
              <View
                style={{
                  width: util.WP(7.2),
                  height: util.WP(7.2),
                  backgroundColor: "#fdda00",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: util.WP(8),
                    fontFamily: "Montserrat-Bold",
                    lineHeight: util.WP(8),
                  }}
                >
                  -
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <Text
              style={{
                marginHorizontal: util.WP(3),
                fontSize: util.WP(4.8),
                fontFamily: "Montserrat-Bold",
                lineHeight: util.WP(4.8),
              }}
            >
              {rowData.quantity
                ? rowData.quantity
                : 1 /*rowData.quantity
                                      ? rowData.quantity % 1 != 0
                                        ? rowData.quantity.toFixed(2)
                                        : rowData.quantity
                                      : rowData.size.split(' ')[0]*/}
            </Text>
            <TouchableWithoutFeedback
              onPress={() => this.increseQuantity(rowData.id, index)}
            >
              <View
                style={{
                  width: util.WP(7.2),
                  height: util.WP(7.2),
                  backgroundColor: "#fdda00",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: util.WP(7),
                    fontFamily: "Montserrat-Bold",
                    lineHeight: util.WP(7.5),
                  }}
                >
                  +
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={{ marginLeft: util.WP(20) }}>
            <TouchableWithoutFeedback
              onPress={() =>
                // this.setState({
                //   bottomDrop: true,
                //   productObj: rowData,
                // })
                this.addProductToList(rowData)
              }
            >
              <View
                style={{
                  backgroundColor: "#32c0f9",
                  width: util.WP(7.6),
                  height: util.WP(7.3),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../../../assets/rightarrow.png")}
                  style={{
                    width: util.WP(2.3),
                    resizeMode: "contain",
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  };
  goToCheckout() {
    console.log("list items after get", this.state.fetchedListItems);
    if (this.state.fetchedListItems) {
      let _orderProducts = [];
      if (this.state.fetchedListItems.products.length) {
        _orderProducts = this.state.fetchedListItems.products;
        _orderProducts.map((product, index) => {
          console.log("products", product);
          _orderProducts[index].stockQuantity = "0";
          if (product.is_scalable) {
            if (product.is_scalable && !product.size.includes("CT")) {
              let _measureUnit = product.size;
              let _price = null;
              let _regular_retail = null;
              if (_measureUnit === "KG" || _measureUnit.includes("KG")) {
                _price = parseFloat(product.unit_retail / 2.20462).toFixed(2);
                _regular_retail = parseFloat(
                  product.regular_retail / 2.20462
                ).toFixed(2);
              }
              if (_measureUnit === "G") {
                _price = parseFloat(product.unit_retail / 453.59237).toFixed(2);
                _regular_retail = parseFloat(
                  product.regular_retail / 453.59237
                ).toFixed(2);
              }
              if (_measureUnit.includes("OZ")) {
                _price = parseFloat(product.unit_retail / 16).toFixed(2);
                _regular_retail = parseFloat(
                  product.regular_retail / 16
                ).toFixed(2);
              }
              if (_measureUnit.includes("lb")) {
                _orderProducts[index].unit_retail = product.unit_retail;
                _orderProducts[index].regular_retail = product.regular_retail;
              }
              _orderProducts[index].size = "lb";
              _orderProducts[index].unit_retail = _price;
              _orderProducts[index].regular_retail = _regular_retail;
            }
          }
          _orderProducts[index].quantity = product.pivot.product_quantity;
          _orderProducts[index].checkoutPrice = parseFloat(
            +product.pivot.product_quantity * +_orderProducts[index].unit_retail
          );
        });
      }
      let _bundles = [];
      this.props.fetchedListItems.bundles?.map((data) => {
        if (data.type == "mix_and_match") {
          if (data.mix_and_match_type == "different_cost_products") {
            let _data = data;
            let _buyProducts = [];
            let _freeProducts = [];
            let _bundle_price = 0;
            _data.mix_n_match_products_added_to_list.map((selectedProduct) => {
              if (selectedProduct.type == "buy") {
                _data.products.map((actualProduct) => {
                  if (actualProduct.product_id == selectedProduct.product_id) {
                    _bundle_price +=
                      Number(actualProduct.price) * selectedProduct.quantity;
                    actualProduct.quantity = selectedProduct.quantity;
                    _buyProducts.push(actualProduct);
                  }
                });
              } else {
                _data.products.map((actualProduct) => {
                  if (actualProduct.product_id == selectedProduct.product_id) {
                    actualProduct.quantity = selectedProduct.quantity;
                    _freeProducts.push(actualProduct);
                  }
                });
              }
            });
            _data.buyProducts = _buyProducts;
            _data.freeProducts = _freeProducts;
            _data.bundle_price = _bundle_price;
            _bundles.push(_data);
          } else {
            let _data = data;
            let _productsToShow = [];
            let _bundlePrice = 0;
            _data.mix_n_match_products_added_to_list.map((selectedProduct) => {
              _data.products.map((actualProduct) => {
                if (actualProduct.product_id == selectedProduct.product_id) {
                  actualProduct.quantity = selectedProduct.quantity;
                  _bundlePrice +=
                    +actualProduct.price * +selectedProduct.quantity;
                  _productsToShow.push(actualProduct);
                }
              });
            });
            _data.buyProducts = _productsToShow;
            let _priceToDeduct =
              +_productsToShow[0].price * +_data.selection_quantity;
            _data.bundle_price = _bundlePrice - _priceToDeduct;
            _bundles.push(_data);
          }
        } else {
          _bundles.push(data);
        }
      });
      let _order = {
        total_price: "",
        card_number: "",
        delivery_details: {
          store_id: "1",
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          address_line_1: "",
          address_line_2: "",
          delivery_method: "curbside",
          license_plate_number: "",
        },
        products: _orderProducts,
        bundles: _bundles,
      };
      // console.log("order", _order);
      this.props.addOrderProducts(_order);
      this.props.navigation.navigate("DeliveryNotices");
    } else {
      util.showToast("Add Products To List");
    }
  }
  orderNow() {
    console.log("active List", this.state.activeList);
    if (this.state.activeList) {
      this.props.getListItemsBundles(this.state.activeList);
    }
  }

  ModalToggler = () => {
    this.setState({ addListModal: !this.state.addListModal });
    this.setState({ bottomDrop: false });
  };
  onCreateNewObject = () => {
    if (this.state.newListName) {
      var addParams = {
        name: this.state.newListName,
        user_id: 2,
      };
      this.props.addNewObjectListBackend(addParams);
    }
    this.setState({ addListModal: false, bottomDrop: false });
  };
  modalAddList() {
    return (
      <Modal isVisible={this.state.addListModal}>
        <View style={{ bottom: util.WP("30") }}>
          <View style={styles.modalClose}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ addListModal: false });
              }}
            >
              <Image
                style={{ height: util.WP(10), width: util.WP(10) }}
                source={require("../../../assets/close-round.png")}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.smallModalContainer}>
            <Text style={styles.modalTitle}>New List</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder={"List Name"}
              placeholderTextColor="#828282"
              value={this.state.newListName}
              onChangeText={(text) => {
                this.setState({ newListName: text });
              }}
            />
            <TouchableOpacity
              style={styles.modalBlueButton}
              onPress={this.onCreateNewObject}
            >
              <Text
                style={{
                  fontSize: util.WP("4"),
                  fontFamily: "Montserrat-SemiBold",
                  color: "#fff",
                }}
              >
                Create
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // promotion button
  handlePromotionButton(params) {
    this.setState({ loader: true });
    this.props.getPoductCoupon(params);
    this.setState({ promotionModal: true, loader: false });
  }

  navigateToCouponDetails(coupon_id) {
    var params = {
      coupon_id: coupon_id,
      routeParam: "Shop",
    };
    util.isOnline(
      () => {
        this.setState({ promotionModal: false });
        this.props.GetShopCouponDetails(params);
      },
      () => {
        util.showToast(util.INTERNET_CONNECTION_ERROR);
      }
    );
  }

  _couponsModal() {
    return (
      <Modal isVisible={this.state.promotionModal} useNativeDriver={true}>
        <View style={{ flex: 1 }}>
          <View style={styles.modalClose}>
            <TouchableOpacity
              onPress={() => this.setState({ promotionModal: false })}
            >
              <Image
                style={{ height: util.WP(10), width: util.WP(10) }}
                source={require("../../../assets/close-round.png")}
              />
            </TouchableOpacity>
          </View>
          {this.props.ShopLoader ? (
            <Image
              style={{
                width: "100%",
                height: util.HP(25),
              }}
              source={require("../../../assets/clientBrand.gif")}
            />
          ) : (
            <View>
              <View
                style={{
                  backgroundColor: "#00adee",
                  height: util.WP(15),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: util.WP(5),
                    fontFamily: "Montserrat-Bold",
                    // paddingTop: 5,
                    // borderBottomWidth: 1,
                    // borderBottomColor: "#ccc",
                    // borderStyle: "solid",
                    paddingBottom: 5,
                  }}
                >
                  Promotions
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#fff",
                  borderColor: "#ccc",
                  borderWidth: 1,
                  borderStyle: "solid",
                  elevation: 20,
                }}
              >
                <View>
                  <FlatList
                    data={this.props.productCoupons}
                    showsHorizontalScrollIndicator={false}
                    numColumns={2}
                    renderItem={({ item: rowData }) => {
                      return (
                        <TouchableOpacity
                          onPress={() =>
                            this.navigateToCouponDetails(rowData.coupon_id)
                          }
                        >
                          <Card
                            title={null}
                            containerStyle={{
                              ...styles.couponCard,
                              marginTop: 0,
                              height: "auto",
                              paddingHorizontal: util.WP(2.9),
                            }}
                          >
                            <View
                              style={{
                                justifyContent: "center",
                                alignItems: "flex-start",
                              }}
                            >
                              <FastImage
                                source={{
                                  uri: rowData.image ? rowData.image : "",
                                  priority: FastImage.priority.normal,
                                }}
                                style={{
                                  width: "100%",
                                  height: util.WP(25),
                                  marginBottom: 5,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                              />
                            </View>
                            <View style={{ flexDirection: "row" }}>
                              <Text
                                numberOfLines={2}
                                style={{
                                  ...styles.h1Title,
                                  fontSize: util.WP(3),
                                  width: "100%",
                                  paddingTop: 0,
                                  minHeight: util.WP(10),
                                }}
                              >
                                {rowData.title}
                              </Text>
                            </View>
                            <View>
                              <Text numberOfLines={3} style={styles.cardDetail}>
                                {rowData.short_description}
                              </Text>
                            </View>
                          </Card>
                        </TouchableOpacity>
                      );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </Modal>
    );
  }

  // FilterByPrice() {
  //   this.setState({
  //     activeBtn: !this.state.activeBtn,
  //     sortbyPriceAscending: !this.state.sortbyPriceAscending,
  //     discountFilter: false,
  //   });
  //   let stateProducts = [...this.state.searchItems];
  //   let sortedProducts;
  //   if (this.state.sortbyPriceAscending) {
  //     sortedProducts = stateProducts.sort(function(a, b) {
  //       return Number(a.unit_retail) < Number(b.unit_retail) ? 1 : -1;
  //     });
  //   } else {
  //     sortedProducts = stateProducts.sort(function(a, b) {
  //       return Number(a.unit_retail) > Number(b.unit_retail) ? 1 : -1;
  //     });
  //   }
  //   this.setState({
  //     searchItems: sortedProducts,
  //   });
  // }

  FilterbyDiscount() {
    let stateProducts = [...this.state.searchItems];
    let _discountedArr = []
    let remainingArr = []
    const promotionArr = stateProducts.filter(
      (item) =>
        item.is_promotional
    );
    const sortedPromotion = promotionArr.sort(
      (a, b) => { return Number(a.unit_retail) - Number(b.unit_retail)}
    );

    let _discountedArray = stateProducts.filter((item) => {
        return item.unit_retail < item.regular_retail
    })
    console.log('DISCOUNTED array', _discountedArray)
    _discountedArr = _discountedArray.sort((a,b) => {
      return Number(a.unit_retail) - Number(b.unit_retail)
    })
    console.log('DISCOUNTED after sort', _discountedArr)
      remainingArray = stateProducts.map((item) => {
        if (
          !item.is_promotional &&
          Number(item.unit_retail) === Number(item.regular_retail)
        ) {
          return item;
        }
        
      });
      console.log('REMANING ARRAY', remainingArray)
      let _tempArray = []
      remainingArray.map((item) => {
        if (item) {
          _tempArray.push(item)
        }
      })
      remainingArr = _tempArray.sort(
        (a,b) => Number(a.unit_retail) - Number(b.unit_retail)
        )
    const final = sortedPromotion.concat(_discountedArr).concat(remainingArr);
    console.log("final", final);
    this.setState({ searchItems: final });
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
        {this.modalAddList()}
        {this._couponsModal()}
        {this.state.stockInfoModalIsVisible && (
          <ProductStockInfoModal
            isVisible={this.state.stockInfoModalIsVisible}
            product={this.state.stockProduct}
            closeModal={this.closeStockModal}
            selectToAdd={this.openproductOverlay}
          />
        )}
        <View
          style={{
            backgroundColor: "#26ACE1",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <View
            style={{
              ...styles.lightBlueContainerMedium,
              height:
                util.isIphoneX() || util.isIphoneXSM()
                  ? util.WP("23")
                  : util.WP("23.5"),
              zIndex: 1,
            }}
          >
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                marginLeft: 10,
                marginRight: 25,
                marginTop: util.HP(2),
              }}
            >
              <Text style={styles.h1ListTitle}>Shop Now</Text>
              <Text style={{ fontSize: util.WP(2.4), color: "#fff" }}>
                Scan bar code, search for specific item or select from the
                categories
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            bottom: util.WP(15) / 2,
            marginHorizontal: util.WP(5),
            height: util.WP(10),
            // width: 'auto',
            zIndex: 100,
          }}
        >
          {!this.state.searchInFocus && (
            <TouchableOpacity
              style={{
                width: util.WP(15.3),
                height: util.WP(12),
                backgroundColor: "#00355F",
                justifyContent: "center",
                alignItems: "center",
                marginRight: util.WP(3),
                zIndex: 5,
                elevation: 1,
                shadowColor: "#000",
                shadowOffset: {
                  width: 1,
                  height: 5,
                },
                shadowOpacity: 0.5,
                shadowRadius: 2,
              }}
              onPress={() =>
                this.props.user
                  ? this.props.navigation.navigate("Scan")
                  : this.askForRegister()
              }
            >
              <Image
                source={require("../../../assets/scan-white.png")}
                style={{ width: util.WP(5), height: util.WP(5) }}
              />
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Montserrat-Medium",
                  fontSize: util.WP(2.2),
                  marginTop: 2,
                }}
              >
                Scan
              </Text>
            </TouchableOpacity>
          )}
          <View
            style={{
              backgroundColor: "#fff",
              height: util.WP(12),
              flexDirection: "row",
              alignItems: "center",
              // width: util.WP(58),
              paddingLeft: util.WP(5),
              paddingRight: util.WP(10),
              marginTop: 0,
              marginBottom: 0,
              flex: 1,
              elevation: 1,
              shadowColor: "#000",
              shadowOffset: {
                width: 1,
                height: 5,
              },
              shadowOpacity: 0.5,
              shadowRadius: 2,
            }}
          >
            <TouchableOpacity onPress={() => this.triggerSearch()}>
              <Image
                style={{
                  height: util.WP(4),
                  width: util.WP(4),
                  marginRight: util.WP("2"),
                }}
                resizeMode="contain"
                source={require("../../../assets/search-blue.png")}
              />
            </TouchableOpacity>
            <TextInput
              style={{
                fontFamily: "Montserrat-SemiBold",
                color: "#00355F",
                fontSize: util.WP(4),
                width: "90%",
                height: "100%",
              }}
              placeholder={"Search"}
              placeholderTextColor="#00355F"
              value={this.state.searchTerm}
              onChangeText={(text) => this.setState({ searchTerm: text })}
              returnKeyType={"search"}
              ref={(ref) => {
                this.SearchInput = ref;
              }}
              // autoFocus={false}
              onFocus={() => this.setState({ searchInFocus: true })}
              onSubmitEditing={(text) => this.triggerSearch()}
            />
          </View>
          {this.state.searchInFocus && (
            <View
              style={{
                flexDirection: "row",
                elevation: 1,
                shadowColor: "#000",
                shadowOffset: {
                  width: 1,
                  height: 5,
                },
                shadowOpacity: 0.5,
                shadowRadius: 2,
              }}
            >
              <TouchableOpacity
                onPress={() => this.triggerSearch()}
                style={{
                  ...styles.whiteButton,
                  marginRight: util.WP(0.1),
                  height: util.WP(12),
                }}
              >
                <Text
                  style={{
                    fontSize: util.WP("4"),
                    fontFamily: "Montserrat-SemiBold",
                    color: "#00355F",
                  }}
                >
                  Search
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.cancelSearch()}
                style={{ ...styles.whiteButton, height: util.WP(12) }}
              >
                <Text
                  style={{
                    fontSize: util.WP("4"),
                    fontFamily: "Montserrat-SemiBold",
                    color: "#00355F",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {this.props.lumperShown ? (
          <View
            style={{
              position: "absolute",
              top:
                util.isIphoneX() || util.isIphoneXSM()
                  ? util.WP("26")
                  : util.WP("23.5"),
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: "rgba(255,255,255,0.9)",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <Image
              style={{
                width: "100%",
                height: util.HP(25),
              }}
              source={require("../../../assets/clientBrand.gif")}
            />
          </View>
        ) : null}

        {!this.props.isGuestUser ? (
          !this.state.localSearch ? (
            this.state.departments && this.state.departments.length ? (
              <FlatList
                data={this.state.departments}
                bounces={false}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item: rowData, index }) => (
                  <View>
                    <TouchableWithoutFeedback
                      onPress={() => this.handleDeptClick(rowData.id)}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingHorizontal: util.WP(6),
                          paddingVertical: util.WP(5.8),
                          backgroundColor: "#fff",
                          elevation: 2,
                          shadowColor: "#000",
                          shadowOpacity: 0.5,
                          shadowOffset: {
                            width: 0,
                            height: 5,
                          },
                          shadowRadius: 5,
                        }}
                      >
                        <Text
                          style={{
                            color: "#004a78",
                            fontSize: util.WP(3.2),
                            fontFamily: "Montserrat-SemiBold",
                          }}
                        >
                          {rowData.name}
                        </Text>
                        <Image
                          source={require("../../../assets/angleDown.png")}
                          style={{
                            width: util.WP(3.6),
                            height: util.WP(2.3),
                            resizeMode: "contain",
                            transform:
                              this.state.department_id === rowData.id
                                ? [{ rotate: "0deg" }]
                                : [{ rotate: "90deg" }],
                          }}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                    <View>
                      {rowData.sub_departments
                        ? rowData.sub_departments.length > 0
                          ? rowData.sub_departments.map((sub) => {
                              if (this.state.department_id === rowData.id) {
                                return (
                                  <View
                                    key={sub.id}
                                    style={{
                                      flex: 1,
                                      backgroundColor: "#f2f2f2",
                                      paddingHorizontal: util.WP(6),
                                    }}
                                  >
                                    <View
                                      style={{
                                        borderBottomWidth: 1,
                                        borderBottomColor: "#a1a1a1",
                                      }}
                                    >
                                      <TouchableOpacity
                                        onPress={() =>
                                          this.handleSubDepartmentClick(
                                            sub,
                                            rowData
                                          )
                                        }
                                        style={{
                                          flexDirection: "row",
                                          justifyContent: "flex-start",
                                          alignItems: "center",
                                        }}
                                      >
                                        <Image
                                          source={require("../../../assets/angleDown.png")}
                                          style={{
                                            width: util.WP(3.6),
                                            height: util.WP(2.3),
                                            resizeMode: "contain",
                                            transform:
                                              this.state.category_id === sub.id
                                                ? [{ rotate: "0deg" }]
                                                : [{ rotate: "-90deg" }],
                                          }}
                                        />

                                        <Text
                                          style={{
                                            paddingVertical: util.WP(3.4),
                                            fontSize: util.WP(3.2),
                                            fontFamily: "Montserrat-Medium",
                                            color: "#001111",
                                            marginLeft: util.WP(5),
                                          }}
                                        >
                                          {sub.name}
                                        </Text>
                                      </TouchableOpacity>
                                    </View>

                                    {/* category */}
                                    {this.props.isLoadingCategories &&
                                      sub.id === this.state.category_id && (
                                        <View
                                          style={{
                                            backgroundColor: "#26ACE1",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexDirection: "row",
                                          }}
                                        >
                                          <View
                                            style={{
                                              alignItems: "flex-end",
                                              justifyContent: "center",
                                              flexDirection: "row",
                                            }}
                                          >
                                            <Text
                                              style={{
                                                paddingVertical: util.WP(3.4),
                                                fontSize: util.WP(3.2),
                                                fontFamily: "Montserrat-Medium",
                                                color: "#f2f2f2",
                                                textAlign: "center",
                                              }}
                                            >
                                              Loading
                                            </Text>
                                            <View
                                              style={{ marginTop: util.WP(2) }}
                                            >
                                              {util.Lumper({
                                                lumper: false,
                                                size: 4,
                                                color: "#fff",
                                              })}
                                            </View>
                                          </View>
                                        </View>
                                      )}
                                    {sub.categories && sub.categories.length > 0
                                      ? sub.categories.map((item) => {
                                          if (
                                            this.state.category_id === sub.id
                                          ) {
                                            return (
                                              <View
                                                style={{
                                                  backgroundColor: "#26ACE1",
                                                }}
                                                key={item.id.toString()}
                                              >
                                                <TouchableOpacity
                                                  onPress={() =>
                                                    this.handleCatClick(
                                                      item,
                                                      rowData,
                                                      sub
                                                    )
                                                  }
                                                  style={{
                                                    flexDirection: "row",
                                                    justifyContent:
                                                      "space-between",
                                                    alignItems: "center",
                                                    marginHorizontal: util.WP(
                                                      1
                                                    ),
                                                  }}
                                                >
                                                  <Text
                                                    style={{
                                                      paddingVertical: util.WP(
                                                        3.4
                                                      ),
                                                      fontSize: util.WP(3.2),
                                                      fontFamily:
                                                        "Montserrat-Medium",
                                                      color: "#f2f2f2",
                                                    }}
                                                  >
                                                    {item.name}
                                                  </Text>
                                                  <Image
                                                    source={require("../../../assets/up_arrow.png")}
                                                    style={{
                                                      width: util.WP(3.6),
                                                      height: util.WP(2.3),
                                                      resizeMode: "contain",
                                                      transform: [
                                                        { rotate: "90deg" },
                                                      ],
                                                    }}
                                                  />
                                                </TouchableOpacity>
                                              </View>
                                            );
                                          }
                                        })
                                      : null}
                                  </View>
                                );
                              }
                            })
                          : null
                        : null}
                    </View>
                  </View>
                )}
                keyExtractor={(item) => String(item.id)}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: util.WP(30),
                }}
              >
                <Text
                  style={{
                    fontSize: util.WP(4),
                    fontFamily: "Montserrat-Bold",
                    color: "#000",
                    textAlign: "center",
                    paddingHorizontal: util.WP(7),
                  }}
                >
                  No data available in this territory!
                </Text>
              </View>
            )
          ) : (
            <View style={{ flex: 1 }}>
              {this.props.advanceSearchItems.products.length > 0 ||
              this.props.advanceSearchItems.categories.length > 0 ? (
                <View style={{ flex: 1, justifyContent: "space-between" }}>
                  <View style={{ flex: 1 }}>
                    {this.props.advanceSearchItems.categories.length > 0 ? (
                      <View
                        style={{
                          flex: 1,
                          paddingHorizontal: util.WP(5),
                          marginBottom: 2,
                          backgroundColor: "#fff",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Montserrat-Bold",
                            fontSize: util.WP(4.5),
                            color: "#00355F",
                            marginLeft: 2,
                            marginBottom: 2,
                          }}
                        >
                          Categories{" "}
                          <Text
                            style={{
                              fontFamily: "Montserrat-Bold",
                              fontSize: util.WP(3),
                              color: "#fc7401",
                            }}
                          >
                            ({this.props.advanceSearchItems.categories.length})
                          </Text>
                        </Text>
                        <FlatList
                          data={this.props.advanceSearchItems.categories}
                          bounces={false}
                          scrollEventThrottle={16}
                          extraData={this.props.advanceSearchItems.categories}
                          keyExtractor={(item, index) => String(index)}
                          renderItem={({ item: rowData }, index) => {
                            return (
                              <View
                                style={{
                                  backgroundColor: "#fff",
                                  marginTop: 1,
                                  paddingHorizontal: 2,
                                }}
                              >
                                <TouchableOpacity
                                  onPress={() =>
                                    this.handleSearchCatClick(rowData)
                                  }
                                  style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      paddingVertical: util.WP(3),
                                      fontSize: util.WP(2.5),
                                      fontFamily: "Montserrat-Medium",
                                      color: "#004a78",
                                    }}
                                  >
                                    {rowData.name}
                                  </Text>
                                  <Image
                                    source={require("../../../assets/angleDown.png")}
                                    style={{
                                      width: util.WP(3.6),
                                      height: util.WP(2.3),
                                      resizeMode: "contain",
                                      transform: [{ rotate: "-90deg" }],
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                            );
                          }}
                        />
                      </View>
                    ) : null}

                    {this.state.searchItems?.length > 0 ? (
                      <View
                        style={{
                          flex: 3,
                          paddingHorizontal: util.WP(5),
                          backgroundColor: "#fff",
                          marginTop: 1,
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              fontFamily: "Montserrat-Bold",
                              fontSize: util.WP(4.5),
                              color: "#00355F",
                              marginLeft: 2,
                              marginBottom: 2,
                            }}
                          >
                            Products{" "}
                            <Text
                              style={{
                                fontFamily: "Montserrat-Bold",
                                fontSize: util.WP(3),
                                color: "#fc7401",
                              }}
                            >
                              ({this.state.searchItems.length})
                            </Text>
                          </Text>
                        </View>
                        <FlatList
                          data={this.state.searchItems}
                          bounces={false}
                          scrollEventThrottle={16}
                          extraData={this.state.overlayId}
                          keyExtractor={(item, index) => String(index)}
                          renderItem={({ item: rowData,index }) => {
                            return (
                              <View style={{ flex: 1 }}>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    backgroundColor: "#fff",
                                    height: "auto",
                                    paddingTop: util.WP(1),
                                    paddingBottom: util.WP(1),
                                    paddingHorizontal: util.WP(1),
                                    marginBottom: util.WP(1),
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#f2f2f2",
                                    width: "100%",
                                  }}
                                >
                                  <View>
                                    {rowData?.images?.length ? (
                                      <FastImage
                                        source={{
                                          uri: rowData?.images[0],
                                          priority: FastImage.priority.normal,
                                        }}
                                        style={{
                                          width: util.WP(15),
                                          height: util.WP(15),
                                          marginRight: util.WP(1.5),
                                        }}
                                        resizeMode={
                                          FastImage.resizeMode.contain
                                        }
                                      />
                                    ) : (
                                      <Image
                                        source={require("../../../assets/noimage2.png")}
                                        style={{
                                          width: util.WP(15),
                                          height: util.WP(15),
                                          resizeMode: "contain",
                                          marginRight: util.WP(1.5),
                                        }}
                                      />
                                    )}
                                  </View>
                                  <View style={{ width: "100%" }}>
                                    <View style={{ width: "80%" }}>
                                      <View style={{ flexDirection: "row" }}>
                                        <Text
                                          numberOfLines={2}
                                          style={{
                                            fontSize: util.WP(3),
                                            fontFamily: "Montserrat-Bold",
                                            flex: 1,
                                            flexWrap: "wrap",
                                          }}
                                        >
                                          {rowData?.name}
                                        </Text>
                                      </View>
                                    </View>

                                    <View
                                      style={{
                                        width: "80%",
                                        flexDirection: "row",
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        paddingVertical: util.WP(1),
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontSize: util.WP(3),
                                          fontFamily: "Montserrat-Light",
                                        }}
                                      >
                                        {rowData?.is_scalable ? (
                                          <Text
                                            style={{
                                              fontFamily: "Montserrat-Bold",
                                              fontSize: util.WP(3),
                                            }}
                                          >
                                            Per{" "}
                                          </Text>
                                        ) : null}
                                        {rowData?.size}
                                      </Text>

                                      {rowData?.regular_retail &&
                                      Number(rowData?.regular_retail) >
                                        Number(rowData?.unit_retail) ? (
                                        <Text
                                          style={{
                                            fontSize: util.WP(4),
                                            fontFamily: "Montserrat-SemiBold",
                                            textDecorationLine: "line-through",
                                            color: "#000",
                                            paddingHorizontal: util.WP(1.5),
                                          }}
                                        >
                                          ${rowData?.regular_retail}
                                        </Text>
                                      ) : null}
                                      <Text
                                        style={{
                                          fontSize: util.WP(4),
                                          fontFamily: "Montserrat-SemiBold",
                                          color:
                                            Number(rowData.regular_retail) >
                                            Number(rowData.unit_retail)
                                              ? "#fc7401"
                                              : "#000",
                                          paddingHorizontal: util.WP(1.5),
                                        }}
                                      >
                                        ${rowData?.unit_retail}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        width: "80%",
                                        flexDirection: "row",
                                        justifyContent: "flex-end",
                                        alignItems: "flex-end",
                                      }}
                                    >
                                      <View
                                        style={{
                                          flexDirection: "row",
                                          justifyContent: "space-between",
                                          alignItems: "flex-end",
                                        }}
                                      >
                                        <View
                                          style={{
                                            marginHorizontal: util.WP(3),
                                          }}
                                        >
                                          {this.props.fetchedLists &&
                                          this.props.fetchedLists.length &&
                                          this.props.fetchedLists.find(
                                            (list) =>
                                              list.id === this.state.activeList
                                          ) ? (
                                            this.props.fetchedLists
                                              .find(
                                                (list) =>
                                                  list.id ===
                                                  this.state.activeList
                                              )
                                              .products?.some(
                                                (product) =>
                                                  product.id === rowData.id
                                              ) ? (
                                              <View
                                                style={{
                                                  flexDirection: "row",
                                                  justifyContent:
                                                    "space-between",
                                                }}
                                              >
                                                <View />
                                                <View style={{ marginTop: 2 }}>
                                                  {this.props.fetchedLists.map(
                                                    (list) => {
                                                      if (
                                                        list.id ===
                                                        this.state.activeList
                                                      ) {
                                                        return list.products.map(
                                                          (product) => {
                                                            if (
                                                              product.id ===
                                                              rowData.id
                                                            ) {
                                                              return (
                                                                <Text
                                                                  key={product.id.toString()}
                                                                  style={{
                                                                    marginHorizontal: util.WP(
                                                                      1
                                                                    ),
                                                                    fontSize: util.WP(
                                                                      4
                                                                    ),
                                                                    fontFamily:
                                                                      "Montserrat-Bold",
                                                                  }}
                                                                >
                                                                  {
                                                                    product
                                                                      .pivot
                                                                      .product_quantity
                                                                  }{" "}
                                                                  {rowData.is_scalable ? (
                                                                    <Text
                                                                      style={{
                                                                        fontFamily:
                                                                          "Montserrat-Bold",
                                                                        fontSize: util.WP(
                                                                          4
                                                                        ),
                                                                      }}
                                                                    >
                                                                      {
                                                                        rowData.size
                                                                      }
                                                                    </Text>
                                                                  ) : null}
                                                                </Text>
                                                              );
                                                            }
                                                          }
                                                        );
                                                      }
                                                    }
                                                  )}
                                                </View>
                                                <View>
                                                  <TouchableOpacity
                                                    onPress={() =>
                                                      this.setState({
                                                        overlayId: rowData.id,
                                                      })
                                                    }
                                                    style={{
                                                      width: util.WP(19.6),
                                                      height: util.WP(6.9),
                                                      borderColor: "#fdda00",
                                                      justifyContent: "center",
                                                      alignItems: "center",
                                                      borderWidth: util.WP(0.6),
                                                    }}
                                                  >
                                                    <Text
                                                      style={{
                                                        fontSize: util.WP(3.6),
                                                        fontFamily:
                                                          "Montserrat-Medium",
                                                        color: "#444444",
                                                      }}
                                                    >
                                                      Added
                                                    </Text>
                                                  </TouchableOpacity>
                                                </View>
                                              </View>
                                            ) : (
                                              <TouchableOpacity
                                                onPress={() =>
                                                  this.setState({
                                                    overlayId: rowData.id,
                                                  })
                                                }
                                                style={{
                                                  width: util.WP(19.6),
                                                  height: util.WP(6),
                                                  backgroundColor: "#fcd605",
                                                  justifyContent: "center",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <Text
                                                  style={{
                                                    fontSize: util.WP(3.6),
                                                    fontFamily:
                                                      "Montserrat-Medium",
                                                  }}
                                                >
                                                  Add +
                                                </Text>
                                              </TouchableOpacity>
                                            )
                                          ) : (
                                            <TouchableOpacity
                                              onPress={() =>
                                                this.setState({
                                                  overlayId: rowData.id,
                                                })
                                              }
                                              style={{
                                                width: util.WP(19.6),
                                                height: util.WP(6),
                                                backgroundColor: "#fcd605",
                                                justifyContent: "center",
                                                alignItems: "center",
                                              }}
                                            >
                                              <Text
                                                style={{
                                                  fontSize: util.WP(3.6),
                                                  fontFamily:
                                                    "Montserrat-Medium",
                                                }}
                                              >
                                                Add +
                                              </Text>
                                            </TouchableOpacity>
                                          )}
                                        </View>
                                        <View>
                                          <TouchableOpacity
                                            onPress={() =>
                                              this.handleProductPress(rowData)
                                            }
                                          >
                                            <View
                                              style={{
                                                width: util.WP(10),
                                                height: util.WP(6),
                                                backgroundColor: "#fcd605",
                                                justifyContent: "center",
                                                alignItems: "center",
                                              }}
                                            >
                                              <Image
                                                source={require("../../../assets/view.png")}
                                                style={{
                                                  width: util.WP(4),
                                                  height: util.WP(4),
                                                  resizeMode: "contain",
                                                }}
                                              />
                                            </View>
                                          </TouchableOpacity>
                                        </View>
                                        {rowData.is_promotional ? (
                                          <TouchableOpacity
                                            style={{ marginLeft: 10 }}
                                            onPress={() =>
                                              this.handlePromotionButton(
                                                rowData.related_coupons
                                              )
                                            }
                                          >
                                            <View
                                              style={{
                                                width: util.WP(11),
                                                height: util.WP(6),
                                                backgroundColor: "#fc7401",
                                                justifyContent: "center",
                                                alignItems: "center",
                                              }}
                                            >
                                              <Text
                                                style={{
                                                  fontSize: util.WP(3.6),
                                                  fontFamily:
                                                    "Montserrat-Medium",
                                                  color: "#fff",
                                                }}
                                              >
                                                SAVE
                                              </Text>
                                            </View>
                                          </TouchableOpacity>
                                        ) : null}
                                      </View>
                                    </View>
                                  </View>
                                </View>
                                {this.state.overlayId === rowData.id
                                  ? this.renderOverlay(rowData, index)
                                  : null}
                              </View>
                            );
                          }}
                        />
                      </View>
                    ) : null}
                  </View>
                  <View style={{ justifyContent: "flex-end" }}>
                    <TouchableWithoutFeedback
                      onPress={() =>
                        this.setState({ bottomDrop: !this.state.bottomDrop })
                      }
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{
                            paddingHorizontal: util.WP(4.9),
                            paddingVertical: util.WP(5),
                            borderTopLeftRadius: 15,
                            borderTopRightRadius: 15,
                            backgroundColor: "#26ACE1",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width:
                              this.state.activeList &&
                              this.props.orderData.order_service_status
                                ? "75%"
                                : "100%",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "flex-start",
                              alignItems: "center",
                            }}
                          >
                            {this.props.fetchedLists &&
                            this.props.fetchedLists.length &&
                            this.state.activeList &&
                            this.props.fetchedLists.find(
                              (list) => list.id === this.state.activeList
                            ) &&
                            this.props.fetchedLists.find(
                              (list) => list.id === this.state.activeList
                            ).products ? (
                              <Text
                                style={{
                                  color: "#fcd605",
                                  fontSize: util.WP(4.8),
                                  fontFamily: "Montserrat-Bold",
                                }}
                              >
                                (
                                {this.props.fetchedLists.map((list) => {
                                  if (list.id == this.state.activeList) {
                                    return (
                                      list.products.length + list.coupon_count
                                    );
                                  }
                                })}
                                )
                              </Text>
                            ) : (
                              <Image
                                source={require("../../../assets/list.png")}
                                style={{
                                  width: util.WP(5),
                                  height: util.WP(6),
                                  resizeMode: "contain",
                                }}
                              />
                            )}

                            <Text
                              style={{
                                fontSize: util.WP(3.6),
                                color: "#fff",
                                fontFamily: "Montserrat-SemiBold",
                                marginLeft: util.WP(2),
                              }}
                            >
                              {this.state.activeList &&
                              this.props.fetchedLists &&
                              this.props.fetchedLists.length
                                ? this.props.fetchedLists.find(
                                    (item) => item.id === this.state.activeList
                                  )
                                  ? this.props.fetchedLists.find(
                                      (item) =>
                                        item.id === this.state.activeList
                                    ).name
                                  : "Select list or Create new to add items"
                                : "Select list or Create new to add items"}
                            </Text>
                          </View>

                          <View>
                            <Image
                              source={require("../../../assets/up_arrow.png")}
                              style={{
                                width: util.WP(4),
                                height: util.WP(2.6),
                                resizeMode: "contain",
                                transform: [
                                  {
                                    rotate: !this.state.bottomDrop
                                      ? "0deg"
                                      : "-180deg",
                                  },
                                ],
                              }}
                            />
                          </View>
                        </View>
                        {this.state.activeList &&
                          this.props.orderData.order_service_status && (
                            <View
                              style={{
                                paddingHorizontal: util.WP(4),
                                paddingVertical: util.WP(5),
                                borderTopLeftRadius: 15,
                                // borderTopRightRadius: 15,
                                backgroundColor: "#fc7401",
                                flexDirection: "row",
                                alignItems: "center",
                                width: "20%",
                              }}
                            >
                              <TouchableOpacity onPress={() => this.orderNow()}>
                                <Text
                                  style={{
                                    fontFamily: "Montserrat-Bold",
                                    color: "#fff",
                                    fontSize: util.WP(2.6),
                                  }}
                                >
                                  ORDER NOW!
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )}
                      </View>
                    </TouchableWithoutFeedback>

                    <View
                      style={{
                        height: this.state.bottomDrop ? "auto" : 0,
                        backgroundColor: "#f2f2f2",
                      }}
                    >
                      <View
                        style={{
                          paddingHorizontal: util.WP(7),
                          paddingTop: util.WP(2),
                          zIndex: 5,
                        }}
                      >
                        <ScrollView style={{ height: util.WP(50) }}>
                          {this.props.fetchedLists &&
                          this.props.fetchedLists.length > 0
                            ? this.props.fetchedLists.map((list) => {
                                return (
                                  <TouchableOpacity
                                    activeOpacity={0.8}
                                    key={list.id}
                                    onPress={() =>
                                      this.props.setActiveList(list.id)
                                    }
                                  >
                                    <Text
                                      style={{
                                        fontSize: util.WP(3.6),
                                        fontFamily: "Montserrat-Medium",
                                        borderBottomWidth: 1,
                                        paddingTop: util.WP(4.7),
                                        paddingBottom: util.WP(4.7),
                                        color: "#444444",
                                        borderBottomColor: "#a1a1a1",
                                      }}
                                    >
                                      {list.name}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              })
                            : null}
                        </ScrollView>
                        <TouchableOpacity
                          style={{
                            marginTop: util.WP(9),
                            marginBottom: util.WP(6),
                          }}
                          onPress={() => this.ModalToggler()}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Image
                              source={require("../../../assets/yellow-plus.png")}
                              style={{
                                width: util.WP(3.6),
                                height: util.WP(3.6),
                                transform: [
                                  {
                                    rotate: this.state.bottomDrop
                                      ? "180deg"
                                      : "0deg",
                                  },
                                ],
                              }}
                            />
                            <Text
                              style={{
                                marginLeft: util.WP(3.7),
                                fontSize: util.WP(4.8),
                                fontFamily: "Montserrat-Medium",
                                color: "#fc7401",
                              }}
                            >
                              Create new list
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: util.WP(4),
                      fontFamily: "Montserrat-Bold",
                      color: "#000",
                      textAlign: "center",
                    }}
                  >
                    No items Found
                  </Text>
                </View>
              )}
            </View>
          )
        ) : (
          <View style={styles.containerWhite}>
            <View style={styles.loader}>
              <Text style={styles.noDataText}>
                Register to browse categories and products!
              </Text>
              <TouchableOpacity
                style={{
                  ...styles.containerButton,
                  width: "30%",
                  padding: 10,
                  marginTop: 20,
                }}
                onPress={() => this.props.navigation.navigate("Login")}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Montserrat-SemiBold",
                    color: "#fff",
                  }}
                >
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lumperShown: state.ui.isLoading,
    isLoadingCategories: state.ui.isLoadingCategories,
    isLoadingListItems: state.ui.isLoadingListItems,
    fetchedListItems: state.Lists.fetchedListItems,
    user: state.login.user,
    isGuestUser: state.login.isGuestUser,
    departments: state.Lists.departments,
    //country: state.login.user.user_info.country,
    fetchedLists: state.Lists.fetchedLists,
    advanceSearchItems: state.Lists.advanceSearchItems,
    orderData: state.Lists.orderData,
    activeList: state.Lists.activeList,
    productCoupons: state.shop.Coupons,
    ShopLoader: state.shop.ShopLoader,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getDepartments: (params) => dispatch(TASKS.GetDepartments(params)),
    getCategories: (id, dept_id, country_code) =>
      dispatch(TASKS.getCategories(id, dept_id, country_code)),
    categoryProducts: (params) => dispatch(TASKS.categoryProducts(params)),
    advanceSearch: (_payload) => dispatch(TASKS.advanceSearch(_payload)),
    getOrderStatus: () => dispatch(TASKS.getOrderStatus()),
    getListItemsBundles: (id) => dispatch(TASKS.getListItemsBundles(id)),
    fetchLists: (callType) => dispatch(TASKS.fetchLists(callType)),
    ShopaddListItem: (params) => dispatch(TASKS.ShopaddListItem(params)),
    setActiveList: (id) => dispatch(TASKS.setActiveList(id)),
    addOrderProducts: (orderProducts) =>
      dispatch(TASKS.addOrderProducts(orderProducts)),
    addNewObjectListBackend: (addParams) =>
      dispatch(TASKS.addNewObjectListBackend(addParams)),
    clearSubdepartmentCategories: (subId, depId) =>
      dispatch(TASKS.clearSubdepartmentCategories(subId, depId)),
    getPoductCoupon: (data) => dispatch(TASKS.fetchShopCoupon(data)),
    GetShopCouponDetails: (data) => dispatch(TASKS.getShopCoupondetails(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShopNow);
