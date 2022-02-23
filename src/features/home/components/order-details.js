import React, { Component } from "react";
import {
  Image,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { styles } from "../../../styles";
import * as util from "../../../utilities";
import moment from "moment";
export default class OrderDetails extends Component {
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
      orderData: this.props.navigation.getParam("items"),
      order: null,
    };
  }
  componentDidMount() {
    console.log(this.state.order);
    if (this.state.orderData) {
      let _order = null;
      _order = { ...this.state.orderData.order };
      _bundles = [..._order.coupons];
      _bundles.map((bundle, index) => {
        let _bundle = bundle;
        if (_bundle.type == "mix_and_match") {
          if (_bundle.mix_and_match_type == "different_cost_products") {
            let _bundlePrice;
            // _bundle.ordered_coupon_products.map((product) => {
            //   _bundlePrice += +product.quantity * +product.unit_retail
            // })
            // _bundle.bundle_price = _bundlePrice
          }
        } else {
        }
      });
    }
  }
  currencyFormat(num) {
    console.log(num);
    return "$" + num?.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  calculateDiscount(product) {
    const { unit_retail, discount_percentage, discount_type } = product;
    if (discount_type == "percentage") {
      return unit_retail - (unit_retail * discount_percentage) / 100;
    } else {
      return unit_retail - discount_percentage;
    }
  }

  BundlePriceCalc(products) {
    return products?.reduce(
      (sum, i) =>
        (sum += Number(i.quantity) * Number(i.unit_retail)) -
        this.calculateDiscount(i),
      0
    );
  }

  MnMBundlePriceCalc(products) {
    console.log("PRODUCTS", products);
    return products?.reduce(
      (sum, i) =>
        (sum +=
          i.type == "buy" ? Number(i.quantity) * Number(i.unit_retail) : null),
      0
    );
  }

  renderBundles(item) {
    return (
      <FlatList
        style={{
          marginTop: 10,
        }}
        data={item.order.coupons}
        renderItem={({ item: rowData, index }) => {
          return rowData.coupon_type == "mix_and_match" ? (
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
              <View
                style={{
                  ...styles.listDetailView,
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    ...styles.listName,
                    fontSize: util.WP(4.4),
                    fontFamily: "Montserrat-Bold",
                  }}
                >
                  {rowData.title}
                </Text>

                {rowData.ordered_coupon_products?.map((product, index) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        padding: 5,
                        paddingRight: 0,
                        paddingBottom: 0,
                        alignItems: "center",
                        marginRight: 15,
                      }}
                      key={product.id}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            paddingRight: 20,
                            fontSize: util.WP(3),
                            fontFamily: "Montserrat-SemiBold",
                            color: "#00355F",
                            maxWidth: util.WP(40),
                            width: "100%",
                          }}
                        >
                          {product.desc}
                        </Text>
                        <Text
                          style={{
                            fontSize: util.WP(3),
                            color: "#FF7600",
                            fontFamily: "Montserrat-SemiBold",
                            marginRight: 10,
                            flex: 0.32,
                          }}
                        >
                          {product.quantity}
                        </Text>
                        <View
                          style={{
                            paddingBottom: 5,
                          }}
                        >
                          {product.type == "select" && (
                            <Text
                              style={{
                                fontSize: util.WP(3),
                                color: "#FF7600",
                                fontFamily: "Montserrat-SemiBold",
                                textAlign: "right",
                              }}
                            >
                              $0.00
                            </Text>
                          )}
                          <Text
                            style={
                              product.type == "select"
                                ? {
                                    textDecorationLine: "line-through",
                                    color: "rgba(0,0,0,0.5)",
                                    fontFamily: "Montserrat-Regular",
                                    fontSize: util.WP(3),
                                    textAlign: "right",
                                  }
                                : {
                                    fontSize: util.WP(3),
                                    color: "#FF7600",
                                    fontFamily: "Montserrat-SemiBold",
                                    textAlign: "right",
                                  }
                            }
                          >
                            ${product.unit_retail}
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
                      fontSize: util.WP(3),
                      fontFamily: "Montserrat-SemiBold",
                      color: "#FF7600",
                      marginRight: util.WP(5),
                    }}
                  >
                    Bundle Price:{" "}
                    {rowData.bundle_price ? util.currencyFormat(Number(rowData.bundle_price)) : "0.00"}
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
              <View
                style={{
                  ...styles.listDetailView,
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    ...styles.listName,
                    fontSize: util.WP(4),
                    fontFamily: "Montserrat-Bold",
                  }}
                >
                  {rowData.title}
                </Text>

                {rowData.ordered_coupon_products?.map((product, index) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        padding: 5,
                        paddingRight: 0,
                        paddingBottom: 0,
                        alignItems: "center",
                        marginRight: 15,
                      }}
                      key={index.toString()}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            paddingRight: 20,
                            fontSize: util.WP(3),
                            fontFamily: "Montserrat-SemiBold",
                            color: "#00355F",
                            maxWidth: util.WP(40),
                            width: "100%",
                          }}
                        >
                          {product.desc}
                        </Text>
                        <Text
                          style={{
                            paddingRight: 20,
                            fontSize: util.WP(3),
                            color: "#FF7600",
                            fontFamily: "Montserrat-SemiBold",
                            marginRight: 10,
                            flex: 0.32,
                          }}
                        >
                          {product.quantity}
                        </Text>
                        <View style={{}}>
                            <Text
                              style={{
                                fontSize: util.WP(3),
                                color: "#FF7600",
                                fontFamily: "Montserrat-SemiBold",
                                textAlign: "right",
                              }}
                            >
                              ${product.discount_price}
                            </Text>
                          {Number(product.discount_percentage) > 0 &&
                          <Text
                            style={{
                                    textDecorationLine: "line-through",
                                    color: "rgba(0,0,0,0.5)",
                                    fontFamily: "Montserrat-Regular",
                                    fontSize: util.WP(3),
                                  }
                                }
                          >
                            ${product.total_price}
                          </Text>
                        }
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
                      fontSize: util.WP(3),
                      fontFamily: "Montserrat-SemiBold",
                      color: "#FF7600",
                      marginRight: util.WP(5),
                    }}
                  >
                    Bundle Price:{" "}
                    {rowData.bundle_price ? util.currencyFormat(Number(rowData.bundle_price)) : ""}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  render() {
    const item = this.props.navigation.getParam("items");
    console.log("ITEM", item);
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={styles.lightBlueContainerSmall}>
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
            <Text style={styles.h1ListTitle}>Order Details</Text>
          </View>
        </View>

        <View style={{ marginHorizontal: 20, marginTop: util.HP(2) }}>
          <Text
            style={{
              color: "#004678",
              fontSize: util.HP(3),
              fontFamily: "Montserrat-SemiBold",
              marginBottom: 5,
              marginTop: util.WP(3.2),
            }}
          >
            Order Information
          </Text>
          <View style={{ backgroundColor: "#fff", padding: util.HP(2.2) }}>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: util.WP(4.2),
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: util.WP(3),
                  }}
                >
                  Order No:{" "}
                  <Text style={{ color: "#FF7600" }}>
                    {" "}
                    #{item.order.order_number}
                  </Text>
                </Text>
                <Text>
                  Date: {moment(item.order.created_at).format("DD/MM/YYYY")}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: util.WP(2.2),
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(0,0,0,.1)",
                }}
              >
                <View style={{ maxWidth: util.WP(35), width: "100%" }}>
                  <Text style={{ fontFamily: "Montserrat-SemiBold" }}>
                    Product Name
                  </Text>
                </View>
                <View>
                  <Text style={{ fontFamily: "Montserrat-SemiBold" }}>
                    Quantity
                  </Text>
                </View>
                <View>
                  <Text style={{ fontFamily: "Montserrat-SemiBold" }}>
                    Price
                  </Text>
                </View>
              </View>

              {item.order.products.map((items, index) => {
                return (
                  <View
                    key={index.toString()}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingVertical: util.WP(1.9),
                    }}
                  >
                    <View
                      style={{ flex: 1, maxWidth: util.WP(40), width: "100%" }}
                    >
                      <Text
                        style={{
                          fontFamily: "Montserrat-Medium",
                          fontSize: util.WP(3),
                          width: "100%",
                        }}
                      >
                        {items.desc}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Montserrat-Medium",
                          fontSize: util.WP(3),
                        }}
                      >
                        {items.size} - ${items.unit_retail}
                      </Text>
                    </View>
                    <View
                      style={{
                        // flex: 0.32,
                        maxWidth: util.WP(10),
                        width: "100%",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Montserrat-Regular",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        {items.quantity}
                      </Text>
                    </View>
                    <View
                      style={{
                        maxWidth: util.WP(18.5),
                        width: "100%",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Montserrat-Regular",
                          textAlign: "right",
                        }}
                      >
                        {util.currencyFormat(Number(items.checkoutPrice))}
                      </Text>
                    </View>
                  </View>
                );
              })}
              {this.renderBundles(item)}
            </View>
          </View>
          <View
            style={{
              backgroundColor: "#fff",
              marginTop: util.WP(4),
              padding: util.WP(4),
              alignItems: "flex-end",
            }}
          >
            <Text
              style={{
                fontSize: util.WP(4.5),
                fontFamily: "Montserrat-SemiBold",
                color: "#FF7600",
              }}
            >
              Total: {util.currencyFormat(parseFloat(item.order.total_price))}
            </Text>
          </View>
          <Text
            style={{
              color: "#004678",
              fontSize: util.HP(3),
              fontFamily: "Montserrat-SemiBold",
              marginBottom: 5,
              marginTop: util.HP(3),
            }}
          >
            Delivery Information
          </Text>
          <View style={{ backgroundColor: "#fff", padding: util.HP(2.2) }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <Text
                style={{
                  fontFamily: "Montserrat-Medium",
                  width: util.WP(25),
                }}
              >
                Store Name
              </Text>
              <Text style={{ fontFamily: "Montserrat-Medium" }}>
                {item.order.delivery_detail.store_name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <Text style={{ fontFamily: "Montserrat-Medium" }}>
                Delivery Method
              </Text>
              <Text style={{ fontFamily: "Montserrat-Medium" }}>
                {item.order.delivery_detail.delivery_method}
              </Text>
            </View>
            {item.order.delivery_detail.delivery_method == "delivery" && (
              <View
                style={{
                  marginTop: 15,
                }}
              >
                <Text
                  style={{ fontFamily: "Montserrat-Medium", marginBottom: 3 }}
                >
                  Address
                </Text>
                <Text style={{ fontFamily: "Montserrat-Medium" }}>
                  {item.order.delivery_detail.address_line_1
                    ? item.order.delivery_detail.address_line_1
                    : item.order.delivery_detail.address_line_2}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    );
  }
}
