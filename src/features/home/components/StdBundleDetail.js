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
    };
    // }
  }

  //   componentDidMount() {
  //     if (this.props.couponDetails) {
  //       let couponId = {
  //         coupon_id: this.props.couponDetails.coupon_detail.coupon_id,
  //       };
  //       let _buyProducts = [];
  //       let _totalQuantity = 0;
  //       _totalQuantity =
  //         Number(
  //           this.props.couponDetails.mix_and_match_conditions.selection_quantity
  //         ) +
  //         Number(this.props.couponDetails.mix_and_match_conditions.buy_quantity);
  //       this.props.couponDetails.products?.map((product) => {
  //         product.quantity = false;
  //         _buyProducts.push(product);
  //       });
  //       let _buyCondition = {
  //         choose: _totalQuantity,
  //         fulfilled: false,
  //       };
  //       let _buyConditionMessage =
  //         "Choose any " + _totalQuantity + " of the product(s)";
  //       let _bundleData = {
  //         coupon_id: this.props.couponDetails.coupon_detail.coupon_id,
  //         buyProducts: _buyProducts,
  //         buyCondition: _buyCondition,
  //         buyConditionsMessage: _buyConditionMessage,
  //       };
  //       this.setState(
  //         {
  //           bundleData: _bundleData,
  //         },
  //         () => {
  //           console.log("list bundle data", this.state.bundleData);
  //         }
  //       );
  //     }
  //   }

  selectListToAdd(product_id) {
    var productData = {
      product_id: product_id,
    };
    this.props.navigation.navigate("SelectList", { productData: productData });
  }

  currencyFormat(num) {
    return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  AddBundleToList(coupon_id, list_coupon_id) {
    this.props.navigation.navigate("SelectList", {
      bundleData: { coupon_id, list_coupon_id },
    });
  }

  render() {
    console.log(this.props.couponDetails);
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
                      Products
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
                        {this.props.couponDetails &&
                          this.props.couponDetails.products?.map(
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
                                          fontSize: util.WP(4),
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
                                            fontSize: util.WP(3),
                                            fontFamily: "Montserrat-SemiBold",
                                          }}
                                        >
                                          Price: ${product.price}
                                        </Text>
                                        <Text
                                          style={{
                                            fontSize: util.WP(3),
                                            fontFamily: "Montserrat-SemiBold",
                                          }}
                                        >
                                          Quantity: {product.quantity}
                                        </Text>
                                      </View>
                                      {/*fsdfsfsdfsfs*/}
                                      {product.discount_percentage > 0 &&
                                      <View
                                        style={{
                                          flexDirection: "row",
                                          justifyContent: "flex-start",
                                          alignItems: "center",
                                        }}
                                      >
                                          <Text
                                              style={{
                                                fontSize: 14,
                                                fontFamily: "Montserrat-Bold",
                                                color: "#004678",
                                                marginRight: 10,
                                              }}
                                            >
                                              ${product.discount_price}
                                            </Text>
                                          <Text
                                            style={
                                              product.discount_percentage > 0
                                                ? {
                                                    fontSize: 12,
                                                    textDecorationLine:
                                                      "line-through",
                                                    color: "rgba(0,0,0,0.5)",
                                                  }
                                                : {
                                                    fontSize: 14,
                                                    fontFamily: "Montserrat-Bold",
                                                    color: "#004678",
                                                  }
                                            }
                                          >
                                            ${product.total_price}
                                          </Text>
                                      </View>
                                    }
                                    </View>
                                  </View>
                                </View>
                              );
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
                      <View>
                        <Text>
                          {this.state.bundleData
                            ? this.state.bundleData.selectConditionMessage
                            : ""}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                {this.props.couponDetails?.coupon_detail?.type !== "barcode" ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.AddBundleToList(
                        this.props?.couponDetails?.coupon_detail?.coupon_id,
                        this.props?.couponDetails?.coupon_detail?.list_coupon_id
                      )
                    }
                    style={{
                      ...styles.addToListBlue,
                      marginTop: 10,
                    }}
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
