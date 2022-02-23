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
    // if (this.props.couponDetails && this.props.couponDetails.coupon_detail) {
    this.state = {
      switchValue: this.props.couponDetails.coupon_detail.active,
      bundleData: null,
      bundleProducts: null,
      addToListDisabled: true,
      selectionAreaVisible: false,
      selection: {
        start: 0,
        end: 0,
      },
    };
    // }
  }

  componentDidMount() {
    console.log("couponDetail", this.props.couponDetails);
    if (this.props.couponDetails) {
      let couponId = {
        coupon_id: this.props.couponDetails.coupon_detail.coupon_id,
      };
      let _buyProducts = [];
      let _selectionProducts = [];
      let _products = [];
      this.props.couponDetails.products?.map((product) => {
        let _product = product;
        _product.quantity = 0;
        _products.push(_product);
      });
      let _requiredQuantity =
        +this.props.couponDetails.mix_and_match_conditions.buy_quantity +
        +this.props.couponDetails.mix_and_match_conditions.selection_quantity;
      let _buyCondition = {
        choose: _requiredQuantity,
        fulfilled: false,
      };
      let _buyConditionMessage =
        "Choose any " + _requiredQuantity + " product(s)!";
      let _selectConditionMessage =
        this.props.couponDetails.mix_and_match_conditions.selection_quantity +
        " free product(s)!";
      let _selectionCondition = {
        choose: this.props.couponDetails.mix_and_match_conditions
          .selection_quantity,
        fulfilled: false,
      };
      let _bundleData = {
        coupon_id: this.props.couponDetails.coupon_detail.coupon_id,
        buyProducts: _buyProducts,
        selectionProducts: _selectionProducts,
        products: _products,
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
  selectListToAdd(product_id) {
    var productData = {
      product_id: product_id,
    };
    this.props.navigation.navigate("SelectList", { productData: productData });
  }
  AddBundleToList(coupon_id) {
    if (this.state.bundleData) {
      let _buyProducts = [];
      let _selectionProducts = [];
      let _products = [];
      this.state.bundleData.products.map((product) => {
        if (product.type != null) {
          if (product.type == "buy") {
            let _product = {
              product_id: product.product_id,
              quantity: product.quantity,
              type: "buy",
            };
            _products.push(_product);
          }
        }
      });

      let _bundleData = {
        coupon_id: this.state.bundleData.coupon_id,
        list_coupon_id: this.state.bundleData.list_coupon_id,
        products: _products,
      };
      this.props.navigation.navigate("SelectList", { bundleData: _bundleData });
    }
  }

  currencyFormat(num) {
    return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  _validateInput() {
    let _quantity = 0;
    let _valueToChoose = 0;
    if (!this.state.bundleData.buyCondition.fulfilled) {
      this.state.bundleData.products.map((product) => {
        if (product.type == "buy") {
          _quantity += product.quantity;
        }
      });
      _valueToChoose = this.state.bundleData.buyCondition.choose - _quantity;
    }
    console.log("value to choose", _valueToChoose);
    if (_valueToChoose > 0) {
      return true;
    } else {
      return false;
    }
  }

  _increseQuantity = (id, index, type) => {
    let _bundleData = { ...this.state.bundleData };
    if (type == "buy") {
      let _products = [..._bundleData.products];
      let _product = { ..._products[index] };
      let _nextQty = _product.quantity + 1;
      if (this._validateInput()) {
        _product.quantity = _nextQty;
        _product.type = "buy";
        _products[index] = _product;
        _bundleData.products = _products;
      }
    }
    this.setState({ bundleData: _bundleData }, () => {
      console.log("on increase Quantity", this.state.bundleData);
      this._validate();
    });
  };
  _decreseQuantity = (id, index, type) => {
    let _bundleData = { ...this.state.bundleData };
    let _products = [..._bundleData.products];
    let _product = { ..._products[index] };

    if (_product.quantity > 0) {
      _product.quantity = _product.quantity - 1;
      if (_product.quantity < 1) {
        _product.type = null;
      }
    } else {
      _product.type = null;
    }
    console.log("_product", _product);
    _products[index] = _product;
    _bundleData.products = _products;
    this.setState({ bundleData: _bundleData }, () => {
      console.log("on decrease Quantity", this.state.bundleData);
      this._validate();
    });
  };

  _validate = () => {
    let _bundleData = { ...this.state.bundleData };
    let _counter = 0;
    _bundleData.products.map((product) => {
      if (product.type == "buy") {
        _counter += product.quantity;
      }
    });
    if (_counter >= _bundleData.buyCondition.choose) {
      _bundleData.buyCondition.fulfilled = true;
      _bundleData.selectionCondition.fulfilled = true;
      _bundleData.buyConditionsMessage =
        "Choose any " + _bundleData.buyCondition.choose + " product(s)!";
    } else {
      _bundleData.buyCondition.fulfilled = false;
      _bundleData.selectionCondition.fulfilled = false;
      let _diff = _bundleData.buyCondition.choose - _counter;
      _bundleData.buyConditionsMessage = "Choose " + _diff + " product(s)!";
    }

    this.setState({ bundleData: _bundleData }, () => {
      console.log("bundle Data after validation", this.state.bundleData);
      if (this.state.bundleData.buyCondition.fulfilled) {
        this.setState({ addToListDisabled: false, conditionsFulfilled: true });
      } else {
        this.setState({ addToListDisabled: true, conditionsFulfilled: false });
      }
    });
  };

  render() {
    return (
      <ScrollView style={styles.containerWhite}>
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

                <View
                  style={{ marginTop: 30, marginLeft: 0, marginBottom: 10 }}
                >
                  {this.props.couponDetails?.coupon_detail?.type !==
                  "barcode" ? (
                    <Text style={[{ marginLeft: 0 }, styles.h1Title]}>
                      Bundle Products
                    </Text>
                  ) : (
                    <Text style={[{ marginLeft: 0 }, styles.h1Title]}>
                      Eligible products
                    </Text>
                  )}

                  {/*Single Card*/}

                  <View style={{ marginTop: 10 }}>
                    <View>
                      <View>
                        {/*<Text>Buy 1 product from the list</Text>*/}
                        <View style={{ flexDirection: "row" }}>
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
                            {this.state.bundleData?.buyCondition.fulfilled
                              ? ""
                              : "*"}
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
                        <View
                          style={{
                            flexDirection: "row",
                            opacity: this.state.bundleData?.selectionCondition
                              .fulfilled
                              ? 1
                              : 0.5,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "Montserrat-Bold",
                              fontSize: util.WP(3),
                              color: "#00355F",
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
                      </View>
                      <View>
                        {this.state.bundleData &&
                          this.state.bundleData.products?.map(
                            (product, index) => {
                              return (
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
                                    opacity: this.state.conditionsFulfilled
                                      ? product.quantity
                                        ? 1
                                        : 0.5
                                      : 1,
                                  }}
                                >
                                  <View>
                                    {product.images.length ? (
                                      <FastImage
                                        source={{
                                          uri: product.images[0],
                                          priority: FastImage.priority.normal,
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
                                            fontFamily: "Montserrat-SemiBold",
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
                                                opacity: this.state.bundleData
                                                  .buyCondition.fulfilled
                                                  ? 0.3
                                                  : 1,
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
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              );
                            }
                          )}
                      </View>
                    </View>
                  </View>
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
