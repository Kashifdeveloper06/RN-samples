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
      activeProduct: null,
      activeList: null,
      list_id: this.props.navigation.state.params.list_id,
      list_name: this.props.navigation.state.params.list_name,
      refresh: true,
      fetching: true,
      isMounted: false,
      showAddItemText: false,
      backArrow: require("../../../../assets/arrow-left-white.png"),
      swipeOutBtns: [
        {
          text: "DELETE",
          color: "#fff",
          backgroundColor: "#FF3B30",
          type: "delete",
          onPress: () => {
            this.props.fetchedListItems.unchecked.map(
              (currElement, thisIndex) => {
                if (this.state.activeProduct == currElement.id) {
                  this.props.fetchedListItems.unchecked.splice(thisIndex, 1);
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
            this.props.fetchedListItems.checked.map(
              (currElement, thisIndex) => {
                if (this.state.activeProduct == currElement.id) {
                  this.props.fetchedListItems.checked.splice(thisIndex, 1);
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
    for (var property in listItems) {
      // if (listItems[property] == 'desc') {
      output += "-" + listItems[property].desc + "\n";
      // }
    }
    return output;
  }
  onShare = async () => {
    try {
      const result = await Share.share({
        message: `Hey There! Please Checkout My List ${
          this.state.list_name
        }\n\nITEMS\n${this.printListItems(
          this.props.fetchedListItems.unchecked
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
  checkThis(index, product_id, list_id) {
    var obj = this.props.fetchedListItems.unchecked[index];
    this.props.fetchedListItems.checked.push(obj);
    this.props.fetchedListItems.unchecked.splice(index, 1);
    this.setState({
      refresh: !this.state.refresh,
    });
    var toggleParams = {
      list_id: list_id,
      product_id: product_id,
    };
    this.props.toggleListItem(toggleParams);
  }
  unCheckThis(index, product_id, list_id) {
    var obj = this.props.fetchedListItems.checked[index];
    this.props.fetchedListItems.unchecked.push(obj);
    this.props.fetchedListItems.checked.splice(index, 1);
    this.setState({
      refresh: !this.state.refresh,
    });
    var toggleParams = {
      list_id: list_id,
      product_id: product_id,
    };
    this.props.toggleListItem(toggleParams);
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
    if (!this.state.fetching && prevState.fetching !== this.state.fetching) {
      if (
        this.props.fetchedListItems.unchecked ||
        this.props.fetchedListItems.checked
      ) {
        this.setState({ showAddItemText: false });
      } else {
        this.setState({ showAddItemText: true });
      }
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
      let _orderProducts = [];
      // console.log('checked', this.props.fetchedListItems.checked)
      // console.log('unchecked', this.props.fetchedListItems.unchecked)
      let checkedItems = [...this.props.fetchedListItems.checked];
      let uncheckedItems = [...this.props.fetchedListItems.unchecked];
      checkedItems.map((item, index) => {
        _orderProducts.push(item);
      });

      uncheckedItems.map((item, index) => {
        _orderProducts.push(item);
      });

      _orderProducts.map((product, index) => {
        console.log(product);
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
          product.pivot.product_quantity * _orderProducts[index].unit_retail
        );
      });

      console.log("PRODUCTS", _orderProducts);

      if (_orderProducts.length) {
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
        };

        this.props.addOrderProducts(_order);
        this.props.navigation.navigate("DeliveryNotices");
        // this.props.navigation.navigate('ThankYou', {orderNumber: '9877987878978989798'})
      } else {
        util.showToast("Add Products To List");
      }
    }
  }
  render() {
    const { fetching, isMounted, showAddItemText } = this.state;
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
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          {!this.props.lumperShown ? (
            !this.props.fetchedListItems.checked.length > 0 &&
            !this.props.fetchedListItems.unchecked.length > 0 ? (
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
              <ScrollView>
                <FlatList
                  style={{
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 20,
                    marginTop: 20,
                  }}
                  data={this.props.fetchedListItems.unchecked}
                  extraData={this.state.refresh}
                  renderItem={({ item: rowData, index }) => {
                    return (
                      <View index={index}>
                        <Swipeout
                          style={{ backgroundColor: "#fff" }}
                          right={this.state.swipeOutBtns}
                          onOpen={(secId, rowId, direction) =>
                            this.onSwipeOpen(
                              rowData.pivot.product_id,
                              rowData.pivot.list_id
                            )
                          }
                          autoClose={true}
                          buttonWidth={util.WP("25")}
                        >
                          <TouchableOpacity
                            onPress={() =>
                              this.checkThis(
                                index,
                                rowData.pivot.product_id,
                                rowData.pivot.list_id
                              )
                            }
                            style={{}}
                          >
                            <View style={styles.listDetailView}>
                              <Image
                                style={{
                                  marginRight: 10,
                                  height: util.WP(7),
                                  width: util.WP(7),
                                }}
                                source={require("../../../../assets/oval.png")}
                              />

                              <Text style={styles.listName}>
                                {rowData.desc}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </Swipeout>
                      </View>
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                />
                <FlatList
                  style={{
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: util.WP("30"),
                  }}
                  data={this.props.fetchedListItems.checked}
                  extraData={this.state.refresh}
                  renderItem={({ item: rowData, index }) => {
                    return (
                      <View index={index}>
                        <Swipeout
                          style={{ backgroundColor: "#fff" }}
                          right={this.state.swipeOutBtns}
                          onOpen={(secId, rowId, direction) =>
                            this.onSwipeOpen(
                              rowData.pivot.product_id,
                              rowData.pivot.list_id
                            )
                          }
                          autoClose={true}
                          buttonWidth={util.WP("25")}
                        >
                          <TouchableOpacity
                            onPress={() =>
                              this.unCheckThis(
                                index,
                                rowData.pivot.product_id,
                                rowData.pivot.list_id
                              )
                            }
                            style={{}}
                          >
                            <View style={styles.listDetailView}>
                              <Image
                                style={{
                                  marginRight: 10,
                                  height: util.WP(7),
                                  width: util.WP(7),
                                }}
                                source={require("../../../../assets/oval-checked.png")}
                              />
                              <Text style={styles.listName}>
                                {rowData.desc}
                              </Text>
                            </View>
                          </TouchableOpacity>
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
            {this.props.fetchedListItems.checked &&
            !this.props.fetchedListItems.checked.length > 0 &&
            this.props.fetchedListItems.unchecked &&
            !this.props.fetchedListItems.unchecked.length > 0 ? (
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListDetail);
