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
import { connect } from "react-redux";
import moment from "moment";
import { StyleSheet } from "react-native";

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      OrderList: this.props.AllOrders,
    };
  }
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
  currencyFormat(num) {
    console.log("num...........", num);
    return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  render() {
    console.log(this.state);
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
      >
        <View style={{ flex: 1 }}>
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
              <Text style={styles.h1ListTitle}>Orders</Text>
            </View>
          </View>
          <View style={{ marginHorizontal: 20, flex: 1 }}>
            {this.state.OrderList.length ? (
              this.state.OrderList &&
              this.state.OrderList.map((items) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("OrderDetails", { items })
                    }
                    key={items.order.id}
                  >
                    <View
                      style={{
                        borderWidth: 0.5,
                        borderColor: "#ccc",
                        padding: 12,
                        borderRadius: 5,
                        marginTop: util.HP(2),
                        backgroundColor: "#fff",
                      }}
                    >
                      <View
                        style={{
                          justifyContent: "space-between",
                          marginBottom: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Montserrat-Medium",
                            fontSize: util.HP(1.8),
                            alignSelf: "flex-end",
                            marginBottom: util.WP(3),
                            color: "#ff7600",
                          }}
                        >
                          Order No: #{items.order.order_number}
                        </Text>

                        {items.order?.products?.length > 0 ? (
                          <View>
                            <Text
                              style={{
                                fontFamily: "Montserrat-Bold",
                                marginBottom: util.WP(2),
                              }}
                            >
                              Products
                            </Text>
                            <Text
                              style={{
                                fontFamily: "Montserrat-SemiBold",
                                fontSize: util.HP(1.8),
                                marginBottom: util.WP(2),
                              }}
                            >
                              {items.order.products.map((product, index) => {
                                return (index ? "," : "") + product.desc;
                              })}
                            </Text>
                          </View>
                        ) : null}

                        <View style={{ flexDirection: "column" }}>
                          {items.order?.coupons && (
                            <>
                              <Text
                                style={{
                                  fontFamily: "Montserrat-Bold",
                                  marginBottom: util.WP(2),
                                }}
                              >
                                Discounts
                              </Text>
                              <View>
                                {items.order?.coupons?.map((coupon, index) => {
                                  return (
                                    <Text
                                      style={{
                                        fontFamily: "Montserrat-SemiBold",
                                        fontSize: util.HP(1.8),
                                        marginBottom: util.WP(2),
                                      }}
                                      key={index}
                                    >
                                      {coupon.title}
                                    </Text>
                                  );
                                })}
                              </View>
                            </>
                          )}
                        </View>
                      </View>
                      <View
                        style={{
                          justifyContent: "space-between",
                          flexDirection: "row",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Montserrat-Medium",
                            fontSize: util.HP(2),
                          }}
                        >
                          Date:{" "}
                          {moment(items.order.created_at).format("DD/MM/YYYY")}
                        </Text>
                        <Text
                          style={{
                            fontFamily: "Montserrat-SemiBold",
                            fontSize: util.HP(2),
                            color: "#ff7600",
                          }}
                        >
                          Total Price :{" "}
                          {util.currencyFormat(
                            parseFloat(items.order.total_price)
                          )}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: util.WP(5), color: "#ff7600" }}>
                  No Pending Orders
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    AllOrders: state.login.OrderList,
  };
};

mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders);
