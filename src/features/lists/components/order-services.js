import React, { Component } from "react";
import {
  Image,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Share,
  Platform,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  FlatList,
} from "react-native";
import { styles } from "../../../styles";
import { connect } from "react-redux";
import * as util from "../../../utilities";
import * as TASKS from "../../../store/actions";
import { TouchableWithoutFeedback } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import Swipeout from "react-native-swipeout";
import RNPickerSelect from "react-native-picker-select";
import Modal from "react-native-modal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import analytics from "@react-native-firebase/analytics";
import ModalDropdown from "react-native-modal-dropdown";

class OrderServices extends Component {
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
      deliveryType: null,
      location: null,
      locationError: false,
      locationErrorText: "",
      DeliveryError: false,
      DeliveryErrorText: "",
      stores: null,
      storeSelectOptions: null,
      isMounted: false,
      orderProducts: this.props.orderRequest.products,
      orderBundles: this.props.orderRequest.bundles,
      orderProductId: null,
      checkingStock: false,
      curbside: false,
      delivery: false,
      deliveryMethod: null,
      showOrderProducts: false,
      showDeliveryOptions: false,
      deliveryMethodModal: false,
      totalCost: 0,
      totalCostError: false,
      quantityError: false,
      stockError: false,
      lowStockModal: false,
      lowStockError: false,
      license: null,
      licenseError: false,
      licenseErrorText: "",
      deliveryMethodSelected: false,
      deliveryStore: null,
      deliveryCompanyId: null,
      deliverCompanyError: false,
      swipeOutBtns: [
        {
          text: "REMOVE",
          color: "#fff",
          backgroundColor: "#FF3B30",
          type: "delete",
          onPress: () => {
            if (this.state.orderProductId) {
              var array = [...this.state.orderProducts];
              array.map((currElement, thisIndex) => {
                if (this.state.orderProductId == currElement.id) {
                  array.splice(thisIndex, 1);
                  // this.calculateTotalCost();
                  // var deleteParams = {
                  //   product_id: this.state.orderProductId,
                  // };
                  // this.props.removeOrderProduct(this.state.orderProductId);
                  // this.setState({ orderProductId: null });
                  return true;
                }
              });
              this.setState({ orderProducts: array }, () => {
                console.log("sdfdsafsfd");
                this.calculateTotalCost();
                this.props.removeOrderProduct(this.state.orderProductId);
                this.setState({ orderProductId: null });
              });
            }
          },
        },
      ],
    };
    this.screenanalytics();
  }
  async screenanalytics() {
    await analytics().logScreenView({
      screen_name: "OrderLocationSelectScreen",
    });
  }
  componentDidMount() {
    console.log("Products", this.state.orderProducts);
    let _stores = [];
    let _storeSelectOptions = [];
    this.props.clientStores.map((store, index) => {
      if (store.country_code == this.props.user.user_info.country) {
        if (store.curbside === "on" || store.delivery === "on") {
          _stores.push(store);
          let _option = {
            label: store.name,
            value: store.id,
          };
          _storeSelectOptions.push(_option);
        }
      }
    });
    // console.log('orderBundles', this.state.orderBundles)
    // if (this.state.orderBundles) {
    //   const _orderBundles = this.state.orderBundles
    //   // console.log('checkout order bundles', _orderBundles)
    //   _orderBundles.map((bundle) => {
    //     console.log('checkout order bundles', bundle)

    //     if (bundle.type == 'mix_and_match') {
    //       let _bundle_price = 0
    //       if (bundle.mix_and_match_type == 'different_cost_products') {
    //         bundle.buyProducts.map((product) => {
    //           _bundle_price += Number(product.price)
    //         })
    //       }
    //       bundle.bundle_price = _bundle_price
    //     }
    //   })
    //   this.setState({orderBundles:_orderBundles})
    // }

    this.setState(
      {
        stores: _stores,
        storeSelectOptions: _storeSelectOptions,
        // orderBundles: _orderBundles
      },
      () => {
        // console.log('bundles in checkout', this.state.orderBundles)
      }
    );
    this.setState({ isMounted: true });
    // console.log('Order Bundles', this.state.orderBundles)
    this.calculateTotalCost();
  }

  DeliveryType = (type) => {
    this.setState({
      deliveryType: type,
      DeliveryError: false,
      DeliveryErrorText: "",
    });
  };

  onDeliveryMethod(type) {
    this.setState({ deliveryType: null });
    this.setState({ deliveryMethodSelected: false });
    this.setState({ deliveryMethod: type });
    this.setState({
      deliveryType: type,
      DeliveryError: false,
      DeliveryErrorText: "",
      deliveryMethodSelected: true,
    });
  }

  onChooseDeliveryMethod() {
    this.setState({
      stockError: false,
      quantityError: false,
      totalCostError: false,
    });
    if (!this.state.location) {
      this.setState({
        locationError: true,
        locationErrorText: "please select location",
      });
    } else {
      let _quantityError = false;
      this.state.orderProducts.map((product, index) => {
        if (parseFloat(product.quantity) == 0) {
          _quantityError = true;
        }
      });
      if (!_quantityError) {
        this.setState({ quantityError: false });

        if (
          parseFloat(this.state.totalCost) >
          parseFloat(this.props.orderData.order_settings.minimum_order_price)
        ) {
          this.setState({ deliveryMethodModal: true });
        } else {
          this.setState({ totalCostError: true });
        }
      } else {
        this.setState({ quantityError: true });
      }
    }
  }

  onNext() {
    if (this.state.deliveryMethod) {
      if (this.state.deliveryMethod === "curbside" && this.state.license) {
        this.props.updateOrderTotal(this.state.totalCost);
        this.props.updateOrderDeliveryMethod(this.state.deliveryMethod);
        this.props.updateOrderCurbsidePlateNumber(this.state.license);
        this.props.updateOrderStoreId(this.state.location);
        this.setState({ deliveryMethodModal: false });
        this.props.navigation.navigate("OrderForm");
      } else {
        this.setState({
          licenseError: true,
          licenseErrorText: "license number required",
        });
      }
      if (
        this.state.deliveryMethod === "delivery" &&
        this.state.deliveryCompanyId
      ) {
        this.props.updateOrderTotal(this.state.totalCost);
        this.props.updateOrderDeliveryMethod(this.state.deliveryMethod);
        this.props.updateOrderStoreId(this.state.location);
        this.props.setDeliveryCompany(this.state.deliveryCompanyId);
        this.setState({ deliveryMethodModal: false });
        this.props.navigation.navigate("OrderForm");
      } else {
        this.setState({ deliverCompanyError: true });
      }
    } else {
      this.setState({
        DeliveryError: true,
        DeliveryErrorText: "Please select delivery method",
      });
    }
  }

  onStoreSelect(val) {
    if (val) {
      this.setState({ checkingStock: true });
      this.setState({ showDeliveryOptions: false });
      this.setState({ curbside: false, delivery: false });
      // console.log('location', this.state.location)
      let deliveryStores = [];
      this.props.clientStores.map((store, index) => {
        if (store.id == val) {
          // console.log('store', store)
          // this.props.setDeliveryCompany({delivery_company_email:store.delivery_company_email,delivery_company_name:store.delivery_company_name})
          if (store.curbside === "on") {
            this.setState({ curbside: true });
          }
          if (store.delivery === "on") {
            this.setState({ delivery: true });
          }
          if (store.delivery === "on" && store.delivery_companies) {
            deliveryStores = store.delivery_companies;
          }
        }
      });
      this.setState({
        deliveryStore: deliveryStores,
      });
      this.props.orderRequest.products.map((product, index) => {
        let _payload = {
          product_id: product.id,
          store_id: val,
        };
        this.props.checkProductsStock(_payload);
      });

      setTimeout(() => {
        this.setState({ checkingStock: false });
        this.setState({ showProducts: true });
        // this.setState({totalCost:0})
        this.setState({ showDeliveryOptions: true });
        this.checkStock();
      }, 1500);
    }
  }

  checkStock() {
    // this.state.orderProducts.map
    let _lowStock = this.props.orderRequest.products.find(
      (data) => data.stockQuantity == "0"
    );
    if (_lowStock !== undefined && !this.state.lowStockError) {
      this.setState({
        lowStockModal: true,
        lowStockError: true,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.orderRequest.products) !==
      JSON.stringify(this.props.orderRequest.products)
    ) {
      // let _lowstock = this.props.orderRequest.products.find(stockQuantity => '0')
      this.setState({ orderProducts: this.props.orderRequest.products });
    }
  }
  onAddQuantity(val, index) {
    // if (val && val > 0) {
    const prods = [...this.state.orderProducts];
    prods[index].quantity = val && val != "." ? val : "0";
    if (val > 0) {
      prods[index].checkoutPrice = val * prods[index].unit_retail;
    }
    var resultArray = Object.keys(prods).map(function(prodsIndex) {
      let _prod = prods[prodsIndex];
      return _prod;
    });
    this.setState({ orderProducts: resultArray });
    this.calculateTotalCost();
    // }
  }
  calculateTotalCost() {
    let _totalCost = 0;
    this.state.orderProducts.map((product, index) => {
      // if (parseInt(product.quantity) > 0) {
      // console.log('PRODUCT', product)
      _totalCost += Number(product.checkoutPrice);
      // }
    });
    this.state.orderBundles?.map((bundle) => {
      _totalCost += Number(bundle.bundle_price);
    });
    console.log("TOTAL COST", _totalCost);
    this.setState({ totalCost: _totalCost });
  }

  onSwipeOpen(productId) {
    this.setState({ orderProductId: productId });
  }
  showProducts() {
    return this.state.orderProducts.map((product, index) => {
      return (
        <Swipeout
          key={index.toString()}
          style={{ backgroundColor: "#fff" }}
          right={this.state.swipeOutBtns}
          onOpen={(secId, rowId, direction) => this.onSwipeOpen(product.id)}
          autoClose={true}
          buttonWidth={util.WP("25")}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              //borderWidth: parseInt(product.stockQuantity) > 10 ? 0 : 0.5,
              borderBottomWidth: 0.5,
              borderColor: "#ccc",
              paddingHorizontal: 5,
              paddingVertical: 5,
              backgroundColor: "#fff",
              marginTop: 5,
            }}
          >
            <View
              style={{
                width: "70%",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {parseInt(product.stockQuantity) < 50 ? (
                <View
                  style={{
                    backgroundColor: "#FCD504",
                    alignItems: "center",
                    width: "33%",
                    borderRadius: 10,
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: util.WP(2.5),
                      fontFamily: "Montserrat-SemiBold",
                      color: "black",
                    }}
                  >
                    Low in Stock
                  </Text>
                </View>
              ) : null}
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  fontFamily: "Montserrat-SemiBold",
                  color: "#004678",
                }}
              >
                {product.desc}
              </Text>
              <Text
                style={{
                  fontSize: util.WP(2.5),
                  fontFamily: "Montserrat-regular",
                  color: "grey",
                }}
              >
                {product.size} - ${product.unit_retail}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                width: "30%",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Montserrat-SemiBold",
                  color: "#FF7600",
                }}
              >
                {this.currencyFormat(product.checkoutPrice)}
              </Text>
              <TextInput
                placeholder="0"
                value={
                  product.quantity > 0 ? product.quantity : null
                  // this.state.orderProducts[index].quantity > 0
                  //   ? this.state.orderProducts[index].quantity
                  //   : null
                }
                onChangeText={(val) => this.onAddQuantity(val, index)}
                keyboardType="decimal-pad"
                returnKeyType={"done"}
                // editable={parseInt(product.stockQuantity) > 10 ? true:false}
                style={{
                  backgroundColor: "#004678",
                  color: "#FF7600",
                  textAlign: "center",
                  width: util.WP(12),
                  height: util.WP(10),
                  fontFamily: "Montserrat-Bold",
                }}
                placeholderTextColor="#FF7600"
              />
            </View>
          </View>
        </Swipeout>
      );
    });
  }
  removeBundle(index) {
    console.log(index);
    let _orderBundles = [...this.state.orderBundles];
    _orderBundles.splice(index, 1);
    // delete _orderBundles[index]
    this.props.deleteOrderBundle(index);
    this.setState({ orderBundles: _orderBundles }, () => {
      this.calculateTotalCost();
    });
  }
  showBundles() {
    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {this.state.orderBundles?.length ? (
          <FlatList
            style={{
              marginLeft: 5,
              marginRight: 5,
              marginTop: 10,
            }}
            data={this.state.orderBundles}
            extraData={this.state.refresh}
            renderItem={({ item: rowData, index }) => {
              return rowData.type == "mix_and_match" ? (
                <View
                  index={index}
                  style={{
                    borderWidth: 1,
                    borderColor:
                      rowData.mix_and_match_type == "different_cost_products"
                        ? "#FCD504"
                        : "#26ACE1",
                    borderStyle: "dashed",
                    marginBottom: 15,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => this.removeBundle(index)}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 10,
                      zIndex: 2,
                      padding: 5,
                    }}
                  >
                    <Icon name="times-circle" size={20} color={"#00355F"} />
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

                    {rowData.buyProducts?.map((product, index) => {
                      return (
                        <View
                          style={{
                            flexDirection: "row",
                            padding: 5,
                            paddingRight: 0,
                            paddingBottom: 0,
                            alignItems: "center",
                            marginRight: 15,
                            // borderBottomWidth:
                            //   index === rowData.buyProducts.length - 1 ? 1 : 0,
                            // borderBottomColor: "#ccc",
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
                                fontSize: util.WP(3),
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
                    {rowData.mix_and_match_type == "same_cost_products" && (
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
                            // borderBottomWidth: 1,
                            // borderBottomColor: "#ccc",
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
                                  fontSize: util.WP(3),
                                  color: "#FF7600",
                                  fontFamily: "Montserrat-SemiBold",
                                }}
                              >
                                $0.00
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    })}

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        borderTopWidth: 1,
                        borderColor: "#ccc",
                        marginTop: 10,
                        paddingTop: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: "Montserrat-SemiBold",
                          color: "#FF7600",
                          marginRight: util.WP(5),
                        }}
                      >
                        Bundle Price:{" "}
                        {this.currencyFormat(rowData.bundle_price)}
                      </Text>
                    </View>
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
                    onPress={() => this.removeBundle(index)}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 10,
                      zIndex: 2,
                      padding: 5,
                    }}
                  >
                    <Icon name="times-circle" size={20} color={"#00355F"} />
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
                            padding: 5,
                            paddingRight: 0,
                            paddingBottom: 0,
                            alignItems: "center",
                            marginRight: 15,
                            // borderBottomWidth:
                            //   index === rowData.products.length - 1 ? 0 : 1,
                            // borderBottomColor: "#ccc",
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
                                      textDecorationLine: "line-through",
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

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        borderTopWidth: 1,
                        borderColor: "#ccc",
                        marginTop: 10,
                        paddingTop: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: "Montserrat-SemiBold",
                          color: "#FF7600",
                          marginRight: util.WP(5),
                        }}
                      >
                        Bundle Price:{" "}
                        {this.currencyFormat(Number(rowData.bundle_price))}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : null}
      </ScrollView>
    );
  }

  modalDeliveryMethodToggler() {
    this.setState({ deliveryMethodModal: !this.state.deliveryMethodModal });
  }

  deliveryDropDownRow(rowData, rowID, highlighted) {
    return (
      <TouchableHighlight underlayColor="cornflowerblue">
        <View
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              marginRight: 4,
              width: 30,
              height: 30,
              resizeMode: "contain",
            }}
            source={{ uri: rowData.icon }}
          />
          <Text style={[highlighted && { color: "#f58121" }]}>
            {rowData.name}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  deliveryDropDownRowText(rowData) {
    const { name } = rowData;
    return name;
  }

  modaldeliveryMethod() {
    return (
      <Modal
        isVisible={this.state.deliveryMethodModal}
        backdropTransitionOutTiming={0}
      >
        <ScrollView>
          <View style={styles.modalClose}>
            <TouchableOpacity
              onPress={() => {
                this.modalDeliveryMethodToggler();
              }}
            >
              <Image
                style={{ height: util.WP(10), width: util.WP(10) }}
                source={require("../../../../assets/close-round.png")}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              ...styles.productModalContainer,
              width: "100%",
              paddingHorizontal: 10,
              paddingVertical: 5,
              height: util.WP(140),
            }}
          >
            <View
              style={{
                textAlign: "centre",
                width: "100%",
                height: util.WP(15),
                paddingTop: 20,
                paddingLeft: 5,
                borderBottomWidth: 1,
                borderBottomColor: "#828282",
              }}
            >
              <Text style={styles.modalTitle}>Choose Order Method</Text>
            </View>
            {this.state.showDeliveryOptions ? (
              <View style={{ flex: 1, marginBottom: util.WP(2) }}>
                <Text
                  style={{
                    fontFamily: "Montserrat-Bold",
                    fontSize: util.WP(4),
                    textAlign: "left",
                    marginTop: util.WP(2),
                    color: "#004678",
                  }}
                >
                  Order for :
                </Text>
                {this.state.DeliveryError && (
                  <Text
                    style={{
                      ...styles.errorTextInput,
                      alignSelf: "flex-start",
                    }}
                  >
                    {this.state.DeliveryErrorText}
                  </Text>
                )}
                {!this.state.curbside && !this.state.delivery ? (
                  <View>
                    <Text>
                      This store does not offer Delivery or Curbside facility.
                    </Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                    {this.state.curbside ? (
                      <TouchableWithoutFeedback
                        onPress={() => this.onDeliveryMethod("curbside")}
                      >
                        <View
                          style={{
                            paddingHorizontal: 5,
                            paddingTop: 10,
                            paddingBottom: 4,
                            flex: 1,
                            alignItems: "center",
                            //borderWidth: 5,
                            marginRight: 6,
                            // borderColor:
                            //   this.state.deliveryType === 'curbside'
                            //     ? '#f58121'
                            //     : '#ced8e1',
                            // backgroundColor:
                            //   this.state.deliveryType === 'curbside'
                            //     ? '#f58121'
                            //     : '#f8f8f8',
                          }}
                        >
                          {this.state.deliveryType === "curbside" ? (
                            <Image
                              source={require("../../../../assets/curbside_on.png")}
                              style={{
                                width: 120,
                                height: 120,
                                resizeMode: "contain",
                              }}
                            />
                          ) : (
                            <Image
                              source={require("../../../../assets/curbside_off.png")}
                              style={{
                                width: 120,
                                height: 120,
                                resizeMode: "contain",
                              }}
                            />
                          )}
                        </View>
                      </TouchableWithoutFeedback>
                    ) : null}

                    {this.state.delivery ? (
                      <TouchableWithoutFeedback
                        onPress={() => this.onDeliveryMethod("delivery")}
                      >
                        <View
                          style={{
                            paddingHorizontal: 5,
                            paddingTop: 10,
                            paddingBottom: 4,
                            flex: 1,
                            alignItems: "center",
                          }}
                        >
                          {this.state.deliveryType === "delivery" ? (
                            <Image
                              source={require("../../../../assets/delivery_on.png")}
                              style={{
                                width: 120,
                                height: 120,
                                resizeMode: "contain",
                              }}
                            />
                          ) : (
                            <Image
                              source={require("../../../../assets/delivery_off.png")}
                              style={{
                                width: 120,
                                height: 120,
                                resizeMode: "contain",
                              }}
                            />
                          )}
                        </View>
                      </TouchableWithoutFeedback>
                    ) : null}
                  </View>
                )}
              </View>
            ) : null}
            {this.state.deliveryType &&
            this.state.deliveryType === "curbside" ? (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Montserrat-Bold",
                      fontSize: util.WP(3),
                      marginBottom: util.WP(2),
                    }}
                  >
                    License Plate Number
                  </Text>
                  {this.state.licenseError && (
                    <Text style={styles.errorTextInput}>
                      {this.state.licenseErrorText}
                    </Text>
                  )}
                </View>
                <TextInput
                  style={{
                    backgroundColor: "#fff",
                    height: util.WP("10"),
                    width: "100%",
                    paddingLeft: 20,
                    fontSize: 14,
                    borderColor: "#F2F2F2",
                    marginBottom: util.WP(3),
                    borderWidth: 1,
                  }}
                  value={this.state.license}
                  onChangeText={(value) => this.setState({ license: value })}
                  placeholder={"Enter your License plate number"}
                  returnKeyType={"done"}
                />
                <View style={{ marginBottom: util.HP(10) }}>
                  <Text
                    style={{
                      fontFamily: "Montserrat-Bold",
                      fontSize: util.HP("2.6"),
                      color: "#f58121",
                    }}
                  >
                    Curbside Notice
                  </Text>
                  <ScrollView style={{ height: util.WP(20) }}>
                    <Text
                      style={{
                        fontSize: util.HP(1.9),
                        color: "grey",
                      }}
                    >
                      {
                        this.props.orderData.order_settings
                          .pickup_customer_notice_text
                      }
                    </Text>
                  </ScrollView>
                </View>
              </View>
            ) : null}

            {this.state.deliveryType &&
            this.state.deliveryType === "delivery" ? (
              <View style={{ flex: 1 }}>
                <View>
                  <Text
                    style={{
                      fontFamily: "Montserrat-bold",
                      fontSize: util.WP(4),
                      color: "#004678",
                    }}
                  >
                    Please choose delivery company
                  </Text>
                  {this.state.deliverCompanyError ? (
                    <Text
                      style={{
                        fontFamily: "Montserrat-regular",
                        fontSize: util.WP(2.2),
                        color: "red",
                      }}
                    >
                      (Tap on one of the provided delivery companies for this
                      store.)
                    </Text>
                  ) : null}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginTop: 2,
                  }}
                >
                  {this.state.deliveryStore.map((dcompany, index) => {
                    return (
                      <TouchableWithoutFeedback
                        onPress={() => {
                          this.setState({ deliverCompanyError: false });
                          this.setState({ deliveryCompanyId: dcompany.id });
                        }}
                        key={index.toString()}
                      >
                        <View
                          style={{
                            paddingHorizontal: 2,
                            paddingTop: 5,
                            paddingBottom: 2,
                            // flex: 3,
                            // alignItems: 'center',
                            borderWidth: this.state.deliveryCompanyId
                              ? this.state.deliveryCompanyId == dcompany.id
                                ? 1
                                : 0
                              : 0,
                            borderColor: this.state.deliveryCompanyId
                              ? this.state.deliveryCompanyId == dcompany.id
                                ? "#f58121"
                                : ""
                              : "",
                          }}
                        >
                          <Image
                            source={{ uri: dcompany.icon }}
                            style={{
                              width: 60,
                              height: 60,
                              resizeMode: "contain",
                            }}
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    );
                  })}
                </View>
                <View style={{ marginBottom: util.HP(10) }}>
                  <Text
                    style={{
                      fontFamily: "Montserrat-Bold",
                      fontSize: util.WP(4),
                      color: "#004678",
                    }}
                  >
                    Delivery Notice
                  </Text>

                  <ScrollView style={{ height: util.WP(20) }}>
                    <Text
                      style={{
                        fontSize: util.HP(1.9),
                        color: "grey",
                      }}
                    >
                      {
                        this.props.orderData.order_settings
                          .delivery_customer_notice_text
                      }
                    </Text>
                  </ScrollView>
                </View>
              </View>
            ) : null}

            <View
              style={{
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={() => this.onNext()}
                style={{ ...styles.addToListBlue }}
              >
                <Text
                  style={{
                    fontSize: util.WP("5"),
                    fontFamily: "Montserrat-SemiBold",
                    color: "#fff",
                  }}
                >
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>
    );
  }
  modalLowStockToggler() {
    this.setState({ lowStockModal: !this.state.lowStockModal });
  }
  lowStockErrorModal() {
    return (
      <Modal
        isVisible={this.state.lowStockModal}
        backdropTransitionOutTiming={0}
      >
        <View style={styles.modalClose}>
          <TouchableOpacity
            onPress={() => {
              this.modalLowStockToggler();
            }}
          >
            <Image
              style={{ height: util.WP(10), width: util.WP(10) }}
              source={require("../../../../assets/close-round.png")}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            ...styles.productModalContainer,
            width: "100%",
            paddingHorizontal: 10,
            paddingVertical: 5,
            height: util.WP(135),
          }}
        >
          <View
            style={{
              textAlign: "centre",
              width: "100%",
              height: util.WP(15),
              paddingTop: 20,
              paddingLeft: 5,
              borderBottomWidth: 1,
              borderBottomColor: "#828282",
            }}
          >
            <Text style={styles.modalTitle}>Stock Message</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Montserrat-Bold",
                fontSize: util.HP("2"),
                textAlign: "left",
                marginTop: util.HP("3"),
                color: "#004678",
              }}
            >
              At client Stores we are dedicated to stocking a wide variety items
              for our customers.
            </Text>

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <View style={{ width: "70%" }}>
                <Text
                  style={{
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: util.WP("3.5"),
                    textAlign: "left",
                    marginTop: util.WP("3"),
                    color: "#004678",
                    marginTop: 10,
                  }}
                >
                  Some of your selected items are
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#FCD504",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  width: "30%",
                  marginTop: 10,
                  borderRadius: 10,
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: util.WP(3),
                    fontFamily: "Montserrat-SemiBold",
                    color: "black",
                  }}
                >
                  Low in Stock
                </Text>
              </View>
            </View>

            <Text
              style={{
                fontFamily: "Montserrat-SemiBold",
                fontSize: util.WP("3.5"),
                textAlign: "left",
                color: "#004678",
              }}
            >
              however our team replenishes stock often. Should we not have the
              item of your choice when your order is processed you will be
              contacted by a member of our team to discuss the availability of
              some items and substitutions if necessary.
            </Text>

            <Text
              style={{
                fontFamily: "Montserrat-SemiBold",
                fontSize: util.WP("3.5"),
                textAlign: "left",
                marginTop: util.WP("3"),
                color: "#004678",
              }}
            >
              <Text
                style={{
                  fontSize: util.WP("3.9"),
                  color: "#F58220",
                  fontFamily: "Montserrat-Bold",
                }}
              >
                Pro Tip:
              </Text>{" "}
              Swipe left on any item to remove it from your lists.
            </Text>

            <View style={{ marginLeft: 10 }}>
              <Image
                source={require("../../../../assets/protip.png")}
                style={{
                  width: "90%",
                  height: util.WP(13),
                  marginLeft: 5,
                  resizeMode: "contain",
                  marginTop: 10,
                }}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={() => this.modalLowStockToggler()}
            style={{ ...styles.addToListBlue, marginTop: 20 }}
          >
            <Text
              style={{
                fontSize: util.WP("5"),
                fontFamily: "Montserrat-SemiBold",
                color: "#fff",
              }}
            >
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
  currencyFormat(num) {
    return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  render() {
    return this.state.isMounted ? (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#f8f8f8", paddingBottom: 10 }}
      >
        <KeyboardAwareScrollView
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="always"
        >
          {this.modaldeliveryMethod()}
          {this.lowStockErrorModal()}
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
                  source={require("../../../../assets/arrow-left-white.png")}
                />
              </TouchableOpacity>
              <Text style={{ ...styles.h1ListTitle, fontSize: util.HP("2.3") }}>
                client Stores Order Services
              </Text>
            </View>
          </View>
          <View style={{ flex: 1, marginHorizontal: 10 }}>
            <View style={{ flex: 1 }}>
              {/*<Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: util.HP('2.8'),
                textAlign: 'left',
                marginTop: 10,
                color: '#004678',
              }}
            >
              client Stores Supermarket Services:
            </Text>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: util.HP('2.8'),
                textAlign: 'left',
                marginTop: util.HP('4.5'),
                color: '#004678',
              }}
            >
              Select location :
            </Text>*/}

              <View
                style={{ backgroundColor: "#fff", marginTop: 20, padding: 8 }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: "#FF7600" }}>Location</Text>
                  {this.state.locationError && (
                    <Text
                      style={{
                        ...styles.errorTextInput,
                        alignSelf: "flex-start",
                      }}
                    >
                      {this.state.locationErrorText}
                    </Text>
                  )}
                </View>
                <RNPickerSelect
                  onValueChange={(value) => {
                    this.setState({
                      location: value,
                      locationError: false,
                      locationErrorText: "",
                    });
                    if (Platform.OS === "android") {
                      this.onStoreSelect(value);
                    }
                  }}
                  // onDonePress={val => {
                  //   this.onCountrySelect();
                  // }}
                  //placeholder={{label: this.props.country ?this.state.countriesData[this.props.country]:'Country (Required)'}}
                  //itemKey={this.props.country?this.props.country:""}
                  value={this.state.location}
                  placeholder={{ label: "Select Location" }}
                  useNativeAndroidPickerStyle={false}
                  style={{
                    ...pickerSelectStyles,

                    placeholder: {
                      color: "#083661",
                      fontSize: Platform.OS === "ios" ? 16 : 14,
                      fontFamily: "Montserrat-Bold",
                      fontSize: 16,
                      marginTop: 10,
                    },
                    viewContainer: {
                      paddingLeft: Platform.OS === "android" ? 12 : 0,
                      borderColor:
                        Platform.OS === "ios" ? "#F2F2F2" : "#828282",
                      height: util.WP(10),
                      borderBottomWidth: 1,
                    },
                    done: { color: "#fff" },
                    modalViewMiddle: {
                      backgroundColor: "#004678",
                      fontFamily: "Montserrat-Bold",
                      fontSize: 14,
                    },
                    modalViewBottom: { backgroundColor: "#fff", color: "#fff" },
                    iconContainer: {
                      top: 15,
                      right: 12,
                    },
                  }}
                  onDonePress={(val) => {
                    // this.setState({location: val})
                    this.onStoreSelect(this.state.location);
                  }}
                  items={this.state.storeSelectOptions}
                  Icon={() => {
                    return (
                      <Image
                        source={require("../../../../assets/angleDown.png")}
                        style={{
                          width: 15,
                          height: 15,
                          resizeMode: "contain",
                        }}
                      />
                    );
                  }}
                />
              </View>

              {this.state.showProducts ? (
                <ScrollView
                  style={{
                    marginTop: 10,
                    marginHorizontal: 2,
                    backgroundColor: "#fff",
                  }}
                >
                  <View style={{ flex: 1, backgroundColor: "#fff" }}>
                    {this.showProducts()}
                    {this.showBundles()}
                    {this.state.checkingStock ? (
                      <View
                        style={{
                          position: "absolute",
                          height: 50,
                          top: "30%",
                          right: 0,
                          left: 0,
                        }}
                      >
                        {util.Lumper({
                          lumper: true,
                          color: "#00355F",
                          size: 30,
                        })}
                      </View>
                    ) : (
                      <View />
                    )}
                  </View>
                </ScrollView>
              ) : (
                <View />
              )}

              {this.state.showProducts ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    // borderBottomWidth: 0.5,
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    backgroundColor: "#fff",
                    marginTop: 3,
                  }}
                >
                  <View
                    style={{
                      width: "70%",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                      marginRight: 10,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 14,
                        fontFamily: "Montserrat-Bold",
                        color: "#004678",
                      }}
                    >
                      Estimated Total:
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      width: "30%",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Montserrat-SemiBold",
                        color: "#FF7600",
                      }}
                    >
                      {this.currencyFormat(this.state.totalCost)}
                    </Text>
                  </View>
                </View>
              ) : null}

              {this.state.showProducts ? (
                <View style={{ backgroundColor: "#fff" }}>
                  <Text
                    style={{
                      fontFamily: "Montserrat-SemiBold",
                      fontSize: util.WP(3),
                      textAlign: "left",
                      marginTop: 10,
                      marginLeft: 5,
                      marginRight: 5,
                      color: "grey",
                    }}
                  >
                    {this.props.orderData.order_settings.order_services_text}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Montserrat-SemiBold",
                      fontSize: util.WP(3),
                      textAlign: "left",
                      marginTop: 5,
                      marginLeft: 5,
                      marginRight: 5,
                      marginBottom: util.HP("5"),
                      color: "grey",
                    }}
                  >
                    {this.props.orderData.order_settings.quantity_text}
                  </Text>
                </View>
              ) : null}
            </View>
            <View>
              {this.state.stockError && (
                <Text style={{ color: "red" }}>
                  One or more products are out of stock.
                </Text>
              )}
              {this.state.quantityError && (
                <Text style={{ color: "red" }}>
                  Please enter quantity of all products.
                </Text>
              )}
              {this.state.totalCostError && (
                <Text style={{ color: "red" }}>
                  Total cost should be greater than $
                  {this.props.orderData.order_settings.minimum_order_price}
                </Text>
              )}
            </View>
            <View style={{ height: 50 }}>
              <TouchableOpacity onPress={() => this.onChooseDeliveryMethod()}>
                <View
                  style={{
                    backgroundColor: "#083560",
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Montserrat-SemiBold",
                      fontSize: 16,
                    }}
                  >
                    Choose Order Method
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    ) : (
      <View />
    );
  }
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    color: "#083661",
    fontFamily: "Montserrat-Bold",
  },
  inputAndroid: {
    fontSize: 16,
    color: "#083661",
    fontFamily: "Montserrat-Bold",
  },
});

mapStateToProps = (state) => {
  return {
    lumperShown: state.ui.isLoading,
    user: state.login.user,
    clientStores: state.login.stores,
    orderRequest: state.Lists.orderRequest,
    orderData: state.Lists.orderData,
  };
};
mapDispatchToProps = (dispatch) => {
  return {
    checkProductsStock: (_payload) =>
      dispatch(TASKS.checkProductsStock(_payload)),
    removeOrderProduct: (productId) =>
      dispatch(TASKS.removeOrderProduct(productId)),
    updateOrderTotal: (total) => dispatch(TASKS.updateOrderTotal(total)),
    updateOrderDeliveryMethod: (method) =>
      dispatch(TASKS.updateOrderDeliveryMethod(method)),
    updateOrderStoreId: (storeId) =>
      dispatch(TASKS.updateOrderStoreId(storeId)),
    updateOrderCurbsidePlateNumber: (plateNumber) =>
      dispatch(TASKS.updateOrderCurbsidePlateNumber(plateNumber)),
    setDeliveryCompany: (deliveryCompany) =>
      dispatch(TASKS.setDeliveryCompany(deliveryCompany)),
    deleteOrderBundle: (bindleIndex) =>
      dispatch(TASKS.deleteOrderBundle(bindleIndex)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderServices);
