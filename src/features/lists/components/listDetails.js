import React, { Component } from "react";
import {
  Image,
  FlatList,
  Button,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Share,
  TouchableWithoutFeedback,
} from "react-native";
import { Card } from "react-native-elements";
import { styles } from "../../../styles";
import Icon from "react-native-vector-icons/FontAwesome5";
import Swiper from "react-native-swiper";
import * as util from "../../../utilities";
import Swipeout from "react-native-swipeout";
import { connect } from "react-redux";
import * as TASKS from "../../../store/actions";
import { NavigationActions, StackActions } from "react-navigation";
import analytics from "@react-native-firebase/analytics";

class ListDetail extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <Image
        style={styles.parentHeaderLogo}
        resizeMode="contain"
        source={require("../../../../assets/Logo.png")}
      />
    ),
    headerLeft: null,
  });
  constructor(props) {
    super(props);
    this.state = {
      activeProduct: null,
      activeList: null,
      list_id: this.props.navigation.state.params.list_id,
      list_name: this.props.navigation.state.params.list_name,
      refresh: true,
      fetching: true,
      isMounted: false,
      showAddItemText: false,
      DeleteConsent: false,
      BundleIndex: null,
      coupon_id: null,
      bundles: null,
      products: null,
      list_coupon_id: null,
      backArrow: require("../../../../assets/arrow-left-white.png"),
      swipeOutBtns: [
        {
          text: "DELETE",
          color: "#fff",
          backgroundColor: "#FF3B30",
          type: "delete",
          onPress: () => {
            this.props.fetchedListItems.bundles.map(
              (currElement, thisIndex) => {
                if (this.state.activeProduct == currElement.coupon_id) {
                  this.props.fetchedListItems.bundles.splice(thisIndex, 1);
                  var deleteParams = {
                    list_id: this.state.activeList,
                    coupon_id: this.state.activeProduct,
                  };
                  this.props.deleteListBundle(deleteParams);
                  this.setState({ activeProduct: null });
                  this.setState({ activeList: null });
                  return true;
                }
              }
            );
            this.props.fetchedListItems.products.map(
              (currElement, thisIndex) => {
                if (this.state.activeProduct == currElement.id) {
                  this.props.fetchedListItems.products.splice(thisIndex, 1);

                  var deleteParams = {
                    list_id: this.state.activeList,
                    product_id: this.state.activeProduct,
                  };
                  this.props.deleteListItem(deleteParams);
                  this.setState({ activeProduct: null });
                  this.setState({ activeList: null });
                  return true;
                }
              }
            );
          },
        },
      ],
    };
    this.screenanalytics();
  }

  async screenanalytics() {
    await analytics().logScreenView({ screen_name: "ListItemsScreen" });
  }
  printListItems(listItems) {
    var output = "";

    if (listItems.bundles.length) {
      listItems.bundles.map((item) => (output += "-" + item.title + "\n"));
    }
    if (listItems.products.length) {
      listItems.products.map((item) => (output += "-" + item.desc + "\n"));
    }
    return output;
  }
  onShare = async () => {
    try {
      const result = await Share.share({
        message: `Hey There! Please Checkout My List ${
          this.state.list_name
        }\n\nITEMS\n${this.printListItems(
          this.props.fetchedListItems
        )} \n\n Create your own shopping lists, Instant client Stores Loyalty Card, Get discounts, coupons and so much more with the client Stores App! Download from App stores today!\n visit: www.clientstores.com/app/ `,
      });

      // if (result.action === Share.sharedAction) {
      //   if (result.activityType) {
      //     // shared with activity type of result.activityType
      //   } else {
      //     // shared
      //   }
      // } else if (result.action === Share.dismissedAction) {
      //   // dismissed
      // }
    } catch (error) {
      alert(error.message);
    }
  };
  onSwipeOpen(product_id, list_id) {
    this.setState({ activeProduct: product_id });
    this.setState({ activeList: list_id });
  }
  fetchListItems() {
    this.setState({ fetching: true });
    var params = {
      list_id: this.state.list_id,
      list_name: this.state.list_name,
    };
    this.props.fetchListItems(params);
    setTimeout(() => {
      this.setState({ fetching: false });
      this.setState({ refresh: !this.state.refresh });
    }, 1000);
  }
  componentDidUpdate(prevProps, prevState) {
    // if (!this.state.fetching && prevState.fetching !== this.state.fetching) {
    //   if (
    //     this.props.fetchedListItems.bundles ||
    //     this.props.fetchedListItems.products
    //   ) {
    //     this.setState({ showAddItemText: false });
    //   } else {
    //     this.setState({ showAddItemText: true });
    //   }
    // }

    if (
      !this.props.lumperShown &&
      this.props.lumperShown !== prevProps.lumperShown
    ) {
      // this.setState({bundles:this.props.fetchedListItems.bundles},() => {
      // console.log('bundles', this.state.bundles)
      console.log("I got in this");
      this._setupBundleData();
      // })
    }
  }
  _setupBundleData() {
    if (this.props.fetchedListItems) {
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
                    actualProduct.quantity = selectedProduct.quantity;
                    _bundle_price +=
                      Number(actualProduct.price) * +actualProduct.quantity;
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
      console.log("Bundles", _bundles);
      this.setState({
        bundles: _bundles,
        products: this.props.fetchedListItems?.products,
      });
    }
  }

  refresh() {
    this.props.addOrderProducts([]);
    setTimeout(() => {
      this.fetchListItems();
    }, 500);
  }
  componentDidMount() {
    // this.focusListener = this.props.navigation.addListener('didFocus', () => {
    this.fetchListItems();
    let _emptyProducts = [];
    this.props.addOrderProducts(_emptyProducts);
    // });
    this.setState({ isMounted: true });
  }

  ActiveListSend() {
    this.props.setActiveList(this.state.list_id);
    this.props.navigation.navigate("Shop", { tab: "list-details" });
  }

  componentWillUnmount() {
    // Remove the event listener
    //this.focusListener.remove();
  }

  onOrderNow() {
    if (!this.state.fetching) {
      this.props.addOrderProducts(null);
      let _orderProducts = this.props.fetchedListItems?.products;
      // console.log('checked', this.props.fetchedListItems.checked)
      // console.log('unchecked', this.props.fetchedListItems.unchecked)
      // let checkedItems = [...this.props.fetchedListItems.checked];
      // let uncheckedItems = [...this.props.fetchedListItems.unchecked];
      // checkedItems.map((item, index) => {
      //   _orderProducts.push(item);
      // });

      // uncheckedItems.map((item, index) => {
      //   _orderProducts.push(item);
      // });

      _orderProducts.map((product, index) => {
        _orderProducts[index].quantity = product.pivot.product_quantity;
        if (product.is_scalable) {
          if (product.is_scalable && !product.size.includes("CT")) {
            let _measureUnit = product.size;
            let _price = null;
            if (_measureUnit === "KG" || _measureUnit.includes("KG")) {
              _price = parseFloat(product.unit_retail / 2.20462).toFixed(2);
            }
            if (_measureUnit === "G") {
              _price = parseFloat(product.unit_retail / 453.59237).toFixed(2);
            }
            if (_measureUnit.includes("OZ")) {
              _price = parseFloat(product.unit_retail / 16).toFixed(2);
            }
            if (_measureUnit.includes("lb")) {
              _price = product.unit_retail;
            }
            _orderProducts[index].size = "lb";
            _orderProducts[index].unit_retail = _price;
          }
        }
        _orderProducts[index].stockQuantity = "0";
        _orderProducts[index].checkoutPrice = parseFloat(
          +product.pivot.product_quantity * _orderProducts[index].unit_retail
        );
      });

      // console.log("PRODUCTS", _orderProducts);

      if (_orderProducts.length || this.state.bundles.length) {
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
          bundles: this.state.bundles,
        };

        this.props.addOrderProducts(_order);
        this.props.navigation.navigate("DeliveryNotices");
        // this.props.navigation.navigate('ThankYou', {orderNumber: '9877987878978989798'})
      } else {
        util.showToast("Add Products To List");
      }
    }
  }

  handleBundleDelete() {
    this.setState({ DeleteConsent: !this.state.DeleteConsent });
    this.props.fetchedListItems.bundles.splice(this.state.BundleIndex, 1);
    var deleteParams = {
      list_id: this.state.list_id,
      coupon_id: this.state.coupon_id,
      list_coupon_id: this.state.list_coupon_id,
    };
    console.log(deleteParams);
    this.props.deleteListBundle(deleteParams);
  }

  editBundle(id) {
    this.state.bundles?.map((bundle) => {
      if (bundle.list_coupon_id == id) {
        if (bundle.mix_and_match_type == "different_cost_products") {
          console.log("bundleeeee", bundle);
          let _buyProducts = [];
          let _selectionProducts = [];
          bundle.products.map((product) => {
            // console.log('PRODUCT', product)
            let _product = product;
            if (_product.type == "buy") {
              //   bundle.buyProducts.map((buyProduct) => {
              //     if (_product.product_id == buyProduct.product_id) {
              _product.quantity = +_product.quantity;
              //     } else {
              //       _product.quantity = 0;
              //     }
              //   });
              _buyProducts.push(_product);
            } else {
              //   bundle.freeProducts.map((freeProduct) => {
              //     if (_product.product_id == freeProduct.product_id) {
              //       _product.quantity = +freeProduct.quantity;
              _product.quantity = +_product.quantity;
              //     } else {
              //       _product.quantity = 0;
              //     }
              //   });
              _selectionProducts.push(_product);
            }
          });
          let _buyCondition = {
            choose: bundle.buy_quantity,
            fulfilled: true,
          };
          let _selectionCondition = {
            choose: bundle.selection_quantity,
            fulfilled: true,
          };

          let _bundleData = {
            coupon_id: bundle.coupon_id,
            list_coupon_id: bundle.list_coupon_id,
            image: bundle.image,
            title: bundle.title,
            list_id: this.state.list_id,
            description: bundle.description,
            short_description: bundle.short_description,
            buyProducts: _buyProducts,
            selectionProducts: _selectionProducts,
            buyCondition: _buyCondition,
            buyConditionsMessage:
              "Buy any " + bundle.buy_quantity + " product(s)!",
            selectionCondition: _selectionCondition,
            selectConditionMessage:
              "Choose any " +
              bundle.selection_quantity +
              " product(s) for free!",
          };

          console.log("_bundleData", _bundleData);
          this.props.navigation.navigate("EditBundleDiffProducts", {
            bundleData: _bundleData,
            onGoBack: () => this.refresh(),
          });
        } else {
          let _buyProducts = [];
          let _selectionProducts = [];
          let _products = [];
          bundle.products.map((product) => {
            let _product = product;
            let obj = bundle.mix_n_match_products_added_to_list.find(
              (o) => o.product_id === _product.product_id
            );
            if (obj) {
              _product.quantity = obj.quantity;
              _product.type = obj.type;
            } else {
              _product.quantity = 0;
              _product.type = null;
            }
            _products.push(_product);
          });
          // bundle.mix_n_match_products_added_to_list.map((product) => {
          //   if (product.type == 'buy') {
          //     _buyProducts.push(product)
          //   }else{
          //     _selectionProducts.push(product)
          //   }
          // })
          let _buyCondition = {
            choose: +bundle.buy_quantity + +bundle.selection_quantity,
            fulfilled: true,
          };
          let _selectionCondition = {
            choose: bundle.selection_quantity,
            fulfilled: true,
          };

          let _bundleData = {
            coupon_id: bundle.coupon_id,
            list_coupon_id: bundle.list_coupon_id,
            image: bundle.image,
            title: bundle.title,
            list_id: this.state.list_id,
            description: bundle.description,
            short_description: bundle.short_description,
            buyProducts: _buyProducts,
            selectionProducts: _selectionProducts,
            buyCondition: _buyCondition,
            buyConditionsMessage:
              "Buy any " + _buyCondition.choose + " product(s)!",
            products: _products,
            selectionCondition: _selectionCondition,
            selectConditionMessage:
              bundle.selection_quantity + " free product(s).",
          };
          console.log("_bundleData", _bundleData);
          this.props.navigation.navigate("EditBundleSameProducts", {
            bundleData: _bundleData,
            onGoBack: () => this.refresh(),
          });
        }
      }
    });
    // this.props.navigation.navigate("EditBundleSameProducts", {
    //   data,
    //   list_id: listID,
    // });
  }

  render() {
    const {
      fetching,
      isMounted,
      showAddItemText,
      bundles,
      products,
    } = this.state;
    return isMounted ? (
      <View style={styles.containerDarker}>
        <View style={styles.blueContainerSmall}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginLeft: 20,
              marginRight: 25,
              marginTop: util.HP(3),
              marginBottom: util.HP(3),
            }}
          >
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() => this.props.navigation.goBack()}
            >
              <Image
                style={{ height: util.WP(7), width: util.WP(7) }}
                source={this.state.backArrow}
              />
            </TouchableOpacity>
            <Text style={styles.h1ListTitle}>{this.state.list_name}</Text>
          </View>
        </View>
        {this.state.DeleteConsent && (
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
              width: "100%",
              backgroundColor: "rgba(0,0,0,0.8)",
              zIndex: 10,
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: util.WP(130),
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  paddingHorizontal: 30,
                  textAlign: "center",
                  fontFamily: "Montserrat-Bold",
                }}
              >
                Are you sure to want to delete the bundle from your list?
              </Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={{
                    ...styles.modalBlueButton,
                    width: util.WP(40),
                  }}
                  onPress={() => this.setState({ DeleteConsent: false })}
                >
                  <Text style={{ color: "#fff" }}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    ...styles.modalBlueButton,
                    width: util.WP(40),
                    marginLeft: 10,
                    backgroundColor: "#FF7600",
                  }}
                  onPress={() => this.handleBundleDelete()}
                >
                  <Text style={{ color: "#fff" }}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <View style={{ flex: 1, justifyContent: "space-between" }}>
          {!this.props.lumperShown ? (
            !products?.length && !bundles?.length ? (
              <View
                style={{
                  flex: 1,
                  marginHorizontal: 20,
                  marginTop: util.WP(15),
                }}
              >
                <Text
                  style={{
                    fontSize: util.WP(6),
                    fontFamily: "Montserrat-Regular",
                    color: "#8b8b8b",
                    lineHeight: util.WP(7.8),
                  }}
                >
                  Welcome to your first list. Use the buttons on the right below
                  to
                  <Text style={{ fontFamily: "Montserrat-SemiBold" }}>
                    {" "}
                    ADD ITEMS.
                  </Text>
                </Text>
                <Text
                  style={{
                    fontSize: util.WP(6),
                    fontFamily: "Montserrat-Regular",
                    color: "#8b8b8b",
                    marginTop: util.WP(8),
                    lineHeight: util.WP(7.8),
                  }}
                >
                  If you need to{" "}
                  <Text style={{ fontFamily: "Montserrat-SemiBold" }}>
                    REMOVE{" "}
                  </Text>
                  an item you can always swipe left on it to remove.
                </Text>
                <Image
                  source={require("../../../../assets/addListTip.png")}
                  style={{ resizeMode: "contain", width: util.WP(73) }}
                />
              </View>
            ) : (
              <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
                {bundles?.length ? (
                  <FlatList
                    style={{
                      marginLeft: 10,
                      marginRight: 10,
                      marginTop: 20,
                    }}
                    data={bundles}
                    extraData={this.state.refresh}
                    renderItem={({ item: rowData, index }) => {
                      return rowData.type == "mix_and_match" ? (
                        <View
                          index={index}
                          style={{
                            borderWidth: 1,
                            borderColor:
                              rowData.mix_and_match_type ==
                              "different_cost_products"
                                ? "#FCD504"
                                : "#26ACE1",
                            borderStyle: "dashed",
                            marginBottom: 15,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({
                                DeleteConsent: !this.state.DeleteConsent,
                                coupon_id: rowData.coupon_id,
                                list_coupon_id: rowData.list_coupon_id,
                                BundleIndex: index,
                              });
                            }}
                            style={{
                              position: "absolute",
                              right: 30,
                              top: 10,
                              zIndex: 2,
                              padding: 5,
                            }}
                          >
                            <Icon
                              name="times-circle"
                              size={18}
                              color={"#00355F"}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              this.editBundle(rowData.list_coupon_id);
                            }}
                            style={{
                              position: "absolute",
                              right: 0,
                              top: 10,
                              zIndex: 2,
                              padding: 5,
                            }}
                          >
                            <Icon name="edit" size={18} color={"#00355F"} />
                          </TouchableOpacity>

                          <View
                            style={{
                              ...styles.listDetailView,
                              flexDirection: "column",
                            }}
                          >
                            <Text
                              style={{
                                ...styles.listName,
                                // maxWidth: util.WP(67),
                                fontSize: util.WP(3.5),
                                fontFamily: "Montserrat-Bold",
                              }}
                            >
                              {rowData.title}
                            </Text>
                            {rowData.buyProducts?.map((product, pIndex) => {
                              return (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    padding: 10,
                                    paddingRight: 0,
                                    paddingBottom: 0,
                                    alignItems: "center",
                                    marginRight: 15,
                                    // borderBottomWidth:
                                    //   pIndex === rowData.buyProducts.length - 1
                                    //     ? 1
                                    //     : 0,
                                    borderBottomColor: "#ccc",
                                  }}
                                  key={product.name}
                                >
                                  <Image
                                    source={{ uri: product.images[0] }}
                                    style={{
                                      width: 30,
                                      height: 30,
                                      marginRight: 10,
                                    }}
                                  />
                                  <View style={{ flex: 1 }}>
                                    <Text
                                      style={{
                                        paddingRight: 20,
                                        fontSize: util.WP(3.2),
                                        fontFamily: "Montserrat-SemiBold",
                                        color: "#00355F",
                                      }}
                                    >
                                      {product.name}
                                    </Text>
                                    <View
                                      style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        paddingBottom: 5,
                                      }}
                                    >
                                      <Text
                                        style={{
                                          paddingRight: 20,
                                          fontSize: util.WP(3),
                                          color: "#FF7600",
                                          fontFamily: "Montserrat-SemiBold",
                                        }}
                                      >
                                        ${product.price} * {product.quantity}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              );
                            })}
                            {rowData.mix_and_match_type ==
                              "same_cost_products" && (
                              <View style={{ marginTop: 3 }}>
                                <Text
                                  style={{
                                    fontSize: util.WP(3),
                                    fontFamily: "Montserrat-Bold",
                                    color: "#FF7600",
                                  }}
                                >
                                  {rowData.selection_quantity} free product(s).
                                </Text>
                              </View>
                            )}
                            {rowData.freeProducts?.map((product, index) => {
                              return (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    padding: 10,
                                    paddingRight: 0,
                                    paddingBottom: 0,
                                    alignItems: "center",
                                    marginRight: 15,
                                    // borderBottomWidth:
                                    //   index === rowData.buyProducts.length - 1
                                    //     ? 0
                                    //     : 1,
                                    borderBottomColor: "#ccc",
                                  }}
                                  key={product.name}
                                >
                                  <Image
                                    source={{ uri: product.images[0] }}
                                    style={{
                                      width: 30,
                                      height: 30,
                                      marginRight: 10,
                                    }}
                                  />
                                  <View style={{ flex: 1 }}>
                                    <Text
                                      style={{
                                        paddingRight: 20,
                                        fontSize: util.WP(3.2),
                                        fontFamily: "Montserrat-SemiBold",
                                        color: "#00355F",
                                      }}
                                    >
                                      {product.name}
                                    </Text>
                                    <View
                                      style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        justifyContent: "flex-start",
                                        paddingBottom: 5,
                                      }}
                                    >
                                      <Text
                                        style={{
                                          paddingRight: 20,
                                          textDecorationLine: "line-through",
                                          textDecorationStyle: "solid",
                                          color: "rgba(0,0,0,0.5)",
                                          fontFamily: "Montserrat-Medium",
                                          fontSize: util.WP(3),
                                        }}
                                      >
                                        ${product.price}
                                      </Text>
                                      <Text
                                        style={{
                                          paddingRight: 20,
                                          color: "#FF7600",
                                          fontSize: util.WP(3),
                                          fontFamily: "Montserrat-SemiBold",
                                        }}
                                      >
                                        $0.00 * {product.quantity}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              );
                            })}
                          </View>
                        </View>
                      ) : (
                        <View
                          index={index}
                          style={{
                            borderWidth: 1,
                            borderColor: "#FF7600",
                            borderStyle: "dashed",
                            marginBottom: 15,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({
                                DeleteConsent: !this.state.DeleteConsent,
                                coupon_id: rowData.coupon_id,
                                list_coupon_id: rowData.list_coupon_id,
                                BundleIndex: index,
                              });
                            }}
                            style={{
                              position: "absolute",
                              right: 0,
                              top: 10,
                              zIndex: 2,
                              padding: 5,
                            }}
                          >
                            <Icon
                              name="times-circle"
                              size={20}
                              color={"#00355F"}
                            />
                          </TouchableOpacity>
                          <View
                            style={{
                              ...styles.listDetailView,
                              flexDirection: "column",
                            }}
                          >
                            <Text
                              style={{
                                ...styles.listName,
                                fontSize: util.WP(3.5),
                                fontFamily: "Montserrat-Bold",
                              }}
                            >
                              {rowData.title}
                            </Text>

                            {rowData.products?.map((product, index) => {
                              return (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    padding: 10,
                                    paddingRight: 0,
                                    paddingBottom: 0,
                                    alignItems: "center",
                                    marginRight: 15,
                                    // borderBottomWidth:
                                    //   index === rowData.products?.length - 1
                                    //     ? 0
                                    //     : 1,
                                    borderBottomColor: "#ccc",
                                  }}
                                  key={product.name}
                                >
                                  <Image
                                    source={{ uri: product.images[0] }}
                                    style={{
                                      width: 30,
                                      height: 30,
                                      marginRight: 10,
                                    }}
                                  />
                                  <View style={{ flex: 1 }}>
                                    <View>
                                      <Text
                                        style={{
                                          paddingRight: 20,
                                          fontSize: util.WP(3.2),
                                          fontFamily: "Montserrat-SemiBold",
                                          color: "#00355F",
                                        }}
                                      >
                                        {product.name}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        marginTop: util.WP(1),
                                      }}
                                    >
                                      <View>
                                        <Text
                                          style={{
                                            paddingRight: 20,
                                            fontSize: util.WP(3.2),
                                            fontFamily: "Montserrat-SemiBold",
                                            color: "#00355F",
                                          }}
                                        >
                                          ${product.price} * {product.quantity}
                                        </Text>
                                      </View>
                                      <View
                                        style={{
                                          flex: 1,
                                          flexDirection: "row",
                                          justifyContent: "flex-start",
                                          paddingBottom: 5,
                                        }}
                                      >
                                        {product.discount_percentage > 0 && (
                                          <Text
                                            style={{
                                              textDecorationLine:
                                                "line-through",
                                              color: "rgba(0,0,0,0.5)",
                                              fontFamily: "Montserrat-Regular",
                                              paddingRight: 10,
                                              fontSize: util.WP(3),
                                            }}
                                          >
                                            ${product.total_price}
                                          </Text>
                                        )}
                                        <Text
                                          style={{
                                            fontSize: util.WP(3),
                                            color: "#FF7600",
                                            fontFamily: "Montserrat-SemiBold",
                                          }}
                                        >
                                          ${product.discount_price}
                                        </Text>
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              );
                            })}
                          </View>
                        </View>
                      ); // standasrd bundle
                    }}
                    keyExtractor={(item, index) => index.toString()}
                  />
                ) : null}

                <FlatList
                  style={{
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 20,
                  }}
                  data={this.props.fetchedListItems.products}
                  extraData={this.state.refresh}
                  renderItem={({ item: rowData, index }) => {
                    return (
                      <View index={index}>
                        <Swipeout
                          style={{ backgroundColor: "#fff" }}
                          right={this.state.swipeOutBtns}
                          onOpen={(secId, rowId, direction) =>
                            this.onSwipeOpen(rowData.id, this.state.list_id)
                          }
                          autoClose={true}
                          buttonWidth={util.WP("25")}
                        >
                          <View
                            style={{
                              ...styles.listDetailView,
                              flexDirection: "column",
                            }}
                          >
                            <Text style={styles.listName}>{rowData.desc}</Text>
                          </View>
                        </Swipeout>
                      </View>
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                />
              </ScrollView>
            )
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Loading...</Text>
            </View>
          )}

          <View>
            {this.props.fetchedListItems &&
            this.props.fetchedListItems.length ? (
              <View
                style={{
                  position: "absolute",
                  bottom: util.WP(21),
                  alignSelf: "flex-end",
                  right: util.WP(10),
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 13,
                    fontFamily: "Montserrat-SemiBold",
                    color: "#00355F",
                    textTransform: "uppercase",
                  }}
                >
                  Add Items
                </Text>
                <Icon
                  name={"caret-down"}
                  size={util.WP(8)}
                  color="#00355F"
                  style={{ textAlign: "center", lineHeight: util.WP(6) }}
                />
              </View>
            ) : null}

            <View
              style={{
                display: "flex",
                width: util.WP("100"),
                height: util.WP("16"),
                justifyContent: "space-between",
                bottom: 0,
                position: "absolute",
                flexDirection: "row",
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <TouchableWithoutFeedback onPress={() => this.onShare()}>
                  <View
                    style={{
                      backgroundColor: "#00355F",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      height: util.WP("20"),
                      width: util.WP("20"),
                      borderTopRightRadius: this.props.orderData
                        .order_service_status
                        ? 0
                        : 15,
                    }}
                  >
                    <Image
                      style={{
                        marginTop: util.WP(2),
                        height: util.WP(10),
                        width: util.WP(10),
                      }}
                      source={require("../../../../assets/share-list.png")}
                    />
                  </View>
                </TouchableWithoutFeedback>
                {this.props.orderData.order_service_status ? (
                  <TouchableWithoutFeedback
                    onPress={() => this.onOrderNow()}
                    // onPress={() => this.props.navigation.navigate('ThankYou', {orderNumber:'CT11122-44234234'})}
                  >
                    <View
                      style={{
                        backgroundColor: "#FF7600",
                        height: util.WP("17"),
                        width: util.WP("26"),
                        borderTopRightRadius: 15,
                        justifyContent: "flex-start",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: util.WP("3"),
                          fontFamily: "Montserrat-Bold",
                          textAlign: "center",
                          paddingHorizontal: 10,
                          marginTop: util.WP(2),
                          textTransform: "uppercase",
                          color: "#fff",
                        }}
                      >
                        Order Now!
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                ) : null}
              </View>

              <View>
                <View style={{ flexDirection: "row" }}>
                  <TouchableWithoutFeedback
                    onPress={
                      () => this.ActiveListSend()
                      // this.props.setActiveList(this.state.list_id),
                      // this.props.navigation.navigate('Shop', {
                      //   list_id: this.state.list_id,
                      //   list_name: this.state.list_name,
                      //   onGoBack: () => this.refresh(),
                      // })
                    }
                  >
                    <View
                      style={{
                        backgroundColor: "#00355F",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingLeft: util.WP("1"),
                        height: util.WP("20"),
                        borderTopLeftRadius: 15,
                        width: util.WP("20"),
                      }}
                    >
                      <Image
                        style={{
                          marginTop: util.WP(2),
                          height: util.WP(10),
                          width: util.WP(10),
                        }}
                        source={require("../../../../assets/search-text.png")}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.props.navigation.navigate("ScanList", {
                        list_id: this.state.list_id,
                        onGoBack: () => this.refresh(),
                      })
                    }
                  >
                    <View
                      style={{
                        backgroundColor: "#00355F",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingLeft: util.WP("1"),
                        height: util.WP("20"),
                        width: util.WP("20"),
                      }}
                    >
                      <Image
                        style={{
                          marginTop: util.WP(2),
                          height: util.WP(10),
                          width: util.WP(10),
                        }}
                        source={require("../../../../assets/scan-text.png")}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    ) : (
      <View />
    );
  }
}
mapStateToProps = (state) => {
  return {
    lumperShown: state.ui.isLoading,
    fetchedListItems: state.Lists.fetchedListItems,
    user: state.login.user,
    orderData: state.Lists.orderData,
  };
};
mapDispatchToProps = (dispatch) => {
  return {
    fetchListItems: (listItemParams) =>
      dispatch(TASKS.fetchListItems(listItemParams)),
    deleteListItem: (deleteParams) =>
      dispatch(TASKS.deleteListItem(deleteParams)),
    toggleListItem: (toggleParams) =>
      dispatch(TASKS.toggleListItem(toggleParams)),
    addOrderProducts: (orderProducts) =>
      dispatch(TASKS.addOrderProducts(orderProducts)),
    setActiveList: (id) => dispatch(TASKS.setActiveList(id)),
    deleteListBundle: (deleteParams) =>
      dispatch(TASKS.deleteListBundle(deleteParams)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListDetail);
