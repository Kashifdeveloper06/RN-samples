import React, { Component } from "react";
import {
  Image,
  Dimensions,
  AsyncStorage,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import { styles } from "../../../styles";
import { Card } from "react-native-elements";
import * as util from "../../../utilities";
import * as TASKS from "../../../store/actions";
import { Text, View, StatusBar } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { connect } from "react-redux";
import moment from "moment";
import Barcode from "react-native-barcode-builder";
import FastImage from "react-native-fast-image";

class couponDetail extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    //header: null,
    //headerMode: 'none',
    //gestures: null,
    //gesturesEnabled: false,
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
      switchValue: this.props.couponDetails.coupon_detail.active,
      bundleData: null,
      bundleProducts: null,
      addToListDisabled: true,
      selectionAreaVisible: false,
      currentSelection: null,
      selection: {
        start: 0,
        end: 0,
      },
    };
  }

  componentDidMount() {
    console.log("coupon detailssssssss", this.props.couponDetails);
    if (this.props.couponDetails) {
      let couponId = {
        coupon_id: this.props.couponDetails.coupon_detail.coupon_id,
      };
      let _buyProducts = [];
      let _selectionProducts = [];
      this.props.couponDetails.products?.map((product) => {
        if (product.type == "buy") {
          product.quantity = 0;
          _buyProducts.push(product);
        }
      });
      this.props.couponDetails.products?.map((product) => {
        if (product.type == "select") {
          product.quantity = 0;
          _selectionProducts.push(product);
        }
      });

      let _buyCondition = {
        choose: this.props.couponDetails.mix_and_match_conditions.buy_quantity,
        selected: 0,
        fulfilled: false,
      };
      let _buyConditionMessage =
        "*Buy any " +
        this.props.couponDetails.mix_and_match_conditions.buy_quantity +
        " product(s)";
      let _selectConditionMessage =
        "*Choose any " +
        this.props.couponDetails.mix_and_match_conditions.selection_quantity +
        " product(s) for free!";
      let _selectionCondition = {
        choose: this.props.couponDetails.mix_and_match_conditions
          .selection_quantity,
        selected: 0,
        fulfilled: false,
      };
      let _bundleData = {
        coupon_id: this.props.couponDetails.coupon_detail.coupon_id,
        buyProducts: _buyProducts,
        selectionProducts: _selectionProducts,
        buyCondition: _buyCondition,
        buyConditionsMessage: _buyConditionMessage,
        selectionCondition: _selectionCondition,
        selectConditionMessage: _selectConditionMessage,
      };
      this.setState(
        {
          bundleData: _bundleData,
        },
        () => {
          console.log("list bundle data", this.state.bundleData);
        }
      );
    }
  }
  toggleCardScan = (value) => {
    this.setState({ switchValue: value });

    if (this.props.couponDetails && this.props.couponDetails.coupon_detail) {
      var params = {
        coupon_id: this.props.couponDetails.coupon_detail.coupon_id,
        couponState: value,
      };
      util.isOnline(
        () => {
          this.props.toggleCardScan(params);
        },
        () => {
          util.showToast(util.INTERNET_CONNECTION_ERROR);
        }
      );
    }
  };

  selectListToAdd(product_id) {
    var productData = {
      product_id: product_id,
    };
    this.props.navigation.navigate("SelectList", { productData: productData });
  }
  AddBundleToList(coupon_id) {
    if (this.state.bundleData) {
      let _products = [];
      this.state.bundleData.buyProducts.map((product) => {
        if (product.quantity > 0) {
          let _product = {
            product_id: product.product_id,
            type: "buy",
            quantity: product.quantity,
          };
          _products.push(_product);
        }
      });
      this.state.bundleData.selectionProducts.map((product) => {
        if (product.quantity > 0) {
          let _product = {
            product_id: product.product_id,
            type: "select",
            quantity: product.quantity,
          };
          _products.push(_product);
        }
      });

      let _bundleData = {
        coupon_id: this.state.bundleData.coupon_id,
        list_coupon_id: this.state.bundleData.list_coupon_id,
        products: _products,
      };
      console.log("navigation Params", _bundleData);
      this.props.navigation.navigate("SelectList", { bundleData: _bundleData });
    }
  }
  currencyFormat(num) {
    return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  validateInput(val, type) {
    let _quantity = 0;
    let _valueToChoose = 0;
    if (type == "buy") {
      this.state.bundleData.buyProducts.map((product) => {
        _quantity += product.quantity;
      });
      _valueToChoose = +this.state.bundleData.buyCondition.choose - _quantity;
    } else {
      this.state.bundleData.selectionProducts.map((product) => {
        _quantity += product.quantity;
      });
      _valueToChoose =
        +this.state.bundleData.selectionCondition.choose - _quantity;
    }

    console.log("Value to Choose", _valueToChoose);
    if (_valueToChoose > 0) {
      return true;
    } else {
      return false;
    }
  }

  _increseQuantity = (id, index, type) => {
    let _bundleData = { ...this.state.bundleData };
    if (type == "buy") {
      let _products = [..._bundleData.buyProducts];
      let _product = { ..._products[index] };
      let _nextQty = _product.quantity + 1;
      if (this.validateInput(_nextQty, type)) {
        _product.quantity = _nextQty;
        _products[index] = _product;
        _bundleData.buyProducts = _products;
      }
    } else {
      let _products = [..._bundleData.selectionProducts];
      let _product = { ..._products[index] };
      let _nextQty = _product.quantity + 1;
      if (this.validateInput(_nextQty, type)) {
        _product.quantity = _nextQty;
        _products[index] = _product;
        _bundleData.selectionProducts = _products;
      }
    }
    this.setState({ bundleData: _bundleData }, () => {
      this._validate();
    });
  };
  _decreseQuantity = (id, index, type) => {
    let _bundleData = { ...this.state.bundleData };
    if (type == "buy") {
      let _products = [..._bundleData.buyProducts];
      let _product = { ..._products[index] };

      if (_product.quantity > 0) {
        _product.quantity = _product.quantity - 1;
        console.log(_product);
        _products[index] = _product;
        _bundleData.buyProducts = _products;
      }
    } else {
      let _products = [..._bundleData.selectionProducts];
      let _product = { ..._products[index] };
      let _nextQty = _product.quantity - 1;
      if (_product.quantity > 0) {
        _product.quantity = _nextQty;
        _products[index] = _product;
        _bundleData.selectionProducts = _products;
      }
    }

    this.setState({ bundleData: _bundleData }, () => {
      console.log("on decrease Quantity", this.state.bundleData);
      this._validate();
    });
  };
  _validate = () => {
    let _bundleData = { ...this.state.bundleData };
    let _counter = 0;

    _bundleData.buyProducts.map((product) => {
      _counter += product.quantity;
    });
    if (_counter >= _bundleData.buyCondition.choose) {
      _bundleData.buyCondition.fulfilled = true;
      this.setState({ selectionAreaVisible: true });
    } else {
      _bundleData.buyCondition.fulfilled = false;
    }

    let _selectCounter = 0;
    _bundleData.selectionProducts.map((product) => {
      _selectCounter += product.quantity;
    });
    if (_selectCounter >= _bundleData.selectionCondition.choose) {
      _bundleData.selectionCondition.fulfilled = true;
    } else {
      _bundleData.selectionCondition.fulfilled = false;
    }

    if (
      _bundleData.buyCondition.fulfilled &&
      _bundleData.selectionCondition.fulfilled
    ) {
      this.setState({ addToListDisabled: false });
    } else {
      this.setState({ addToListDisabled: true });
    }
    this.setState({ bundleData: _bundleData });
  };

  render() {
    return (
      <ScrollView
        style={styles.containerWhite}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.orangeContainerLarge}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginLeft: 20,
              marginTop: util.WP(5),
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
            <Text style={styles.h1ListTitle}>Discount Details</Text>
          </View>
        </View>
        {this.props.couponDetails != null ? (
          moment(this.props.couponDetails.coupon_detail.end_date).format(
            "YYYY-MM-DD"
          ) > moment().format("YYYY-MM-DD") ? (
            <SafeAreaView>
              <View style={styles.couponDetailContainer}>
                <View
                    style={{ width:"100%"}}
                  >
                    <Image
                      style={{
                        width: '100%',
                        height: util.WP(47.5),
                        resizeMode: "contain",
                        marginLeft:0,
                        marginRight:0
                      }}
                      source={
                        this.props.couponDetails.coupon_detail.image
                          ? {
                              uri: this.props.couponDetails.coupon_detail.image,
                            }
                          : require("../../../../assets/no-image.png")
                      }
                    />
                  </View>
                <View style={{marginTop:util.WP(5)}}>
                <Text
                      style={{
                        ...styles.h1SubTitle,
                        fontSize: util.WP(3.8),
                        paddingLeft: 0,
                      }}
                    >
                      {this.props.couponDetails.coupon_detail.title}
                    </Text>
                <Text style={styles.couponItemDescription}>
                  {this.props.couponDetails.coupon_detail.description}
                </Text>
                </View>
                {/*this.props.couponDetails?.coupon_detail?.type !== "barcode" && 
              <TouchableOpacity style={[styles.swiperCouponButton,{backgroundColor:"#FB7300",justifyContent:"center",alignItems:"center",width:"auto",flex:1,marginHorizontal:20,height:util.WP(12)}]}>
                 <Text style={[styles.btnaddToList,{color:"#fff",fontSize:16}]}>Redeem Now</Text>
              </TouchableOpacity> */}

                <View style={{ marginTop: 30, marginLeft: 0, marginBottom: 5 }}>
                  <Text
                    style={{
                      ...styles.h1Title,
                      marginLeft: 0,
                      fontSize: util.WP("4"),
                    }}
                  >
                    Products
                  </Text>

                  {/*Single Card*/}
                  {this.props.couponDetails.coupon_detail.type ==
                  "mix_and_match" ? (
                    this.props.couponDetails.coupon_detail.mix_and_match_type ==
                    "different_cost_products" ? (
                      <View style={{ marginTop: 10 }}>
                        <View>
                          <View
                            style={{
                              flexDirection: "row",
                              marginBottom: util.WP(4),
                            }}
                          >
                            {/*<Text>Buy 1 product from the list</Text>*/}
                            <Text
                              style={{
                                fontFamily: "Montserrat-Bold",
                                fontSize: util.WP(3),
                                color: this.state.bundleData?.buyCondition
                                  .fulfilled
                                  ? "#00355F"
                                  : "red",
                              }}
                            >
                              {this.state.bundleData
                                ? this.state.bundleData.buyConditionsMessage
                                : ""}
                            </Text>
                            {this.state.bundleData?.buyCondition.fulfilled && (
                              <Image
                                style={{
                                  width: util.WP(5),
                                  height: util.WP(5),
                                  resizeMode: "contain",
                                }}
                                source={require("../../../../assets/checkbox.png")}
                              />
                            )}
                          </View>

                          <View>
                            {this.state.bundleData &&
                              this.state.bundleData.buyProducts?.map(
                                (product, index) => {
                                  return product.type == "buy" ? (
                                    <View
                                      key={index.toString()}
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
                                        marginLeft: util.WP(0),
                                        width: "95%",
                                        opacity: this.state.bundleData
                                          .buyCondition.fulfilled
                                          ? product.quantity
                                            ? 1
                                            : 0.2
                                          : 1,
                                      }}
                                    >
                                      <View>
                                        {product.images.length ? (
                                          <FastImage
                                            source={{
                                              uri: product.images[0],
                                              priority:
                                                FastImage.priority.normal,
                                            }}
                                            style={{
                                              width: util.WP(14),
                                              height: util.WP(14),
                                              marginRight: util.WP(1.5),
                                            }}
                                            resizeMode={
                                              FastImage.resizeMode.contain
                                            }
                                          />
                                        ) : (
                                          <Image
                                            source={require("../../../../assets/noimage2.png")}
                                            style={{
                                              width: util.WP(15),
                                              height: util.WP(18),
                                              resizeMode: "contain",
                                              marginRight: util.WP(1.5),
                                            }}
                                          />
                                        )}
                                      </View>
                                      <View style={{ width: "100%" }}>
                                        <View style={{ width: "80%" }}>
                                          <Text
                                            style={{
                                              fontSize: util.WP(3.5),
                                              fontFamily: "Montserrat-Bold",
                                              flex: 1,
                                              flexWrap: "wrap",
                                              color: "#00355F",
                                            }}
                                          >
                                            {product.name}
                                          </Text>
                                        </View>
                                        <View
                                          style={{
                                            width: "80%",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                          }}
                                        >
                                          <View>
                                            <Text
                                              style={{
                                                fontSize: util.WP(4),
                                                fontFamily:
                                                  "Montserrat-SemiBold",
                                              }}
                                            >
                                              ${product.price}
                                            </Text>
                                          </View>
                                          {/*fsdfsfsdfsfs*/}
                                          <View
                                            style={{
                                              flexDirection: "row",
                                              justifyContent: "flex-start",
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
                                                onPress={() =>
                                                  this._decreseQuantity(
                                                    product.product_id,
                                                    index,
                                                    "buy"
                                                  )
                                                }
                                              >
                                                <View
                                                  style={{
                                                    width: util.WP(7.2),
                                                    height: util.WP(7.2),
                                                    backgroundColor: "#fdda00",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    opacity:
                                                      product.quantity > 0
                                                        ? 1
                                                        : 0.5,
                                                  }}
                                                >
                                                  <Text
                                                    style={{
                                                      fontSize: util.WP(8),
                                                      fontFamily:
                                                        "Montserrat-Bold",
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
                                                {product.quantity
                                                  ? product.quantity
                                                  : 0 /*rowData.quantity
                                                                          ? rowData.quantity % 1 != 0
                                                                            ? rowData.quantity.toFixed(2)
                                                                            : rowData.quantity
                                                                          : rowData.size.split(' ')[0]*/}
                                              </Text>
                                              <TouchableWithoutFeedback
                                                onPress={() =>
                                                  this._increseQuantity(
                                                    product.product_id,
                                                    index,
                                                    "buy"
                                                  )
                                                }
                                              >
                                                <View
                                                  style={{
                                                    width: util.WP(7.2),
                                                    height: util.WP(7.2),
                                                    backgroundColor: "#fdda00",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    opacity: this.state
                                                      .bundleData.buyCondition
                                                      .fulfilled
                                                      ? 0.3
                                                      : 1,
                                                  }}
                                                >
                                                  <Text
                                                    style={{
                                                      fontSize: util.WP(7),
                                                      fontFamily:
                                                        "Montserrat-Bold",
                                                      lineHeight: util.WP(7.5),
                                                    }}
                                                  >
                                                    +
                                                  </Text>
                                                </View>
                                              </TouchableWithoutFeedback>
                                            </View>
                                          </View>
                                        </View>
                                      </View>
                                    </View>
                                  ) : null;
                                }
                              )}
                          </View>
                        </View>

                        <View
                          style={{
                            marginTop: 10,
                            opacity: this.state.selectionAreaVisible ? 1 : 0.2,
                          }}
                        >
                          <View style={{ flexDirection: "row" }}>
                            <Text
                              style={{
                                fontFamily: "Montserrat-Bold",
                                fontSize: util.WP(3),
                                color: this.state.bundleData?.selectionCondition
                                  .fulfilled
                                  ? "#00355F"
                                  : "red",
                              }}
                            >
                              {this.state.bundleData
                                ? this.state.bundleData.selectConditionMessage
                                : ""}
                            </Text>
                            {this.state.bundleData?.selectionCondition
                              .fulfilled && (
                              <Image
                                style={{
                                  width: util.WP(5),
                                  height: util.WP(5),
                                  resizeMode: "contain",
                                }}
                                source={require("../../../../assets/checkbox.png")}
                              />
                            )}
                          </View>
                          <View>
                            {/*Free Selection Products*/}
                            {this.state.bundleData &&
                              this.state.bundleData.selectionProducts.map(
                                (product, index) => {
                                  return product.type == "select" ? (
                                    <View
                                      key={index.toString()}
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
                                        marginLeft: util.WP(2),
                                        width: "95%",
                                        opacity: this.state.bundleData
                                          .selectionCondition.fulfilled
                                          ? product.quantity
                                            ? 1
                                            : 0.2
                                          : 1,
                                      }}
                                    >
                                      <View>
                                        {product.images.length ? (
                                          <FastImage
                                            source={{
                                              uri: product.images[0],
                                              priority:
                                                FastImage.priority.normal,
                                            }}
                                            style={{
                                              width: util.WP(14),
                                              height: util.WP(14),
                                              marginRight: util.WP(1.5),
                                            }}
                                            resizeMode={
                                              FastImage.resizeMode.contain
                                            }
                                          />
                                        ) : (
                                          <Image
                                            source={require("../../../../assets/noimage2.png")}
                                            style={{
                                              width: util.WP(15),
                                              height: util.WP(18),
                                              resizeMode: "contain",
                                              marginRight: util.WP(1.5),
                                            }}
                                          />
                                        )}
                                      </View>
                                      <View style={{ width: "100%" }}>
                                        <View style={{ width: "80%" }}>
                                          <Text
                                            style={{
                                              fontSize: util.WP(3),
                                              fontFamily: "Montserrat-Bold",
                                              flex: 1,
                                              flexWrap: "wrap",
                                            }}
                                          >
                                            {product.name}
                                          </Text>
                                        </View>
                                        <View
                                          style={{
                                            width: "80%",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                          }}
                                        >
                                          <View>
                                            <Text
                                              style={{
                                                fontSize: util.WP(4),
                                                fontFamily:
                                                  "Montserrat-SemiBold",
                                              }}
                                            >
                                              ${product.price}
                                            </Text>
                                          </View>
                                          {/*fsdfsfsdfsfs*/}
                                          <View
                                            style={{
                                              flexDirection: "row",
                                              justifyContent: "flex-start",
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
                                                onPress={() =>
                                                  this._decreseQuantity(
                                                    product.product_id,
                                                    index,
                                                    "select"
                                                  )
                                                }
                                              >
                                                <View
                                                  style={{
                                                    width: util.WP(7.2),
                                                    height: util.WP(7.2),
                                                    backgroundColor: "#fdda00",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    opacity:
                                                      product.quantity > 0
                                                        ? 1
                                                        : 0.3,
                                                  }}
                                                >
                                                  <Text
                                                    style={{
                                                      fontSize: util.WP(8),
                                                      fontFamily:
                                                        "Montserrat-Bold",
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
                                                {product.quantity
                                                  ? product.quantity
                                                  : 0 /*rowData.quantity
                                                                          ? rowData.quantity % 1 != 0
                                                                            ? rowData.quantity.toFixed(2)
                                                                            : rowData.quantity
                                                                          : rowData.size.split(' ')[0]*/}
                                              </Text>
                                              <TouchableWithoutFeedback
                                                onPress={() =>
                                                  this._increseQuantity(
                                                    product.product_id,
                                                    index,
                                                    "select"
                                                  )
                                                }
                                              >
                                                <View
                                                  style={{
                                                    width: util.WP(7.2),
                                                    height: util.WP(7.2),
                                                    backgroundColor: "#fdda00",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    opacity: this.state
                                                      .bundleData
                                                      .selectionCondition
                                                      .fulfilled
                                                      ? 0.3
                                                      : 1,
                                                  }}
                                                >
                                                  <Text
                                                    style={{
                                                      fontSize: util.WP(7),
                                                      fontFamily:
                                                        "Montserrat-Bold",
                                                      lineHeight: util.WP(7.5),
                                                    }}
                                                  >
                                                    +
                                                  </Text>
                                                </View>
                                              </TouchableWithoutFeedback>
                                            </View>
                                          </View>
                                        </View>
                                      </View>
                                    </View>
                                  ) : null;
                                }
                              )}
                          </View>
                        </View>
                      </View>
                    ) : (
                      <View />
                    )
                  ) : null}
                </View>
                {this.props.couponDetails?.coupon_detail?.type !== "barcode" ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.AddBundleToList(
                        this.props?.couponDetails?.coupon_detail?.coupon_id
                      )
                    }
                    style={{
                      ...styles.addToListBlue,
                      marginTop: 10,
                      opacity: this.state.addToListDisabled ? 0.8 : 1,
                    }}
                    disabled={this.state.addToListDisabled}
                  >
                    <Text
                      style={{
                        fontSize: util.WP("5"),
                        fontFamily: "Montserrat-SemiBold",
                        color: "#fff",
                      }}
                    >
                      Add Bundle To List
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </SafeAreaView>
          ) : (
            <View
              style={{
                flex: 1,
                alignSelf: "center",
                height: "100%",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <Text style={styles.viewAll}>This coupon has expired!</Text>
            </View>
          )
        ) : (
          <View style={styles.loader}>{util.Lumper({ lumper: true })}</View>
        )}
      </ScrollView>
    );
  }
}
mapStateToProps = (state) => {
  return {
    lumperShown: state.ui.isLoading,
    couponDetails: state.promotions.couponDetails,
    cardScan: state.promotions.cardScan,
  };
};
mapDispatchToProps = (dispatch) => {
  return {
    toggleCardScan: (params) => dispatch(TASKS.toggleCardScan(params)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(couponDetail);
