import React, { Component } from "react";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import { styles } from "../../styles";
import { Card } from "react-native-elements";
import * as util from "../../utilities";
import * as TASKS from "../../store/actions";
import { Text, View, StatusBar } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { connect } from "react-redux";
import moment from "moment";
import Barcode from "react-native-barcode-builder";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/FontAwesome5";

class MnmDifferentShop extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    //header: null,
    //headerMode: 'none',
    //gestures: null,
    //gesturesEnabled: false,
    headerTitle: (
      <Image
        style={styles.parentHeaderLogo}
        resizeMode="contain"
        source={require("../../../assets/clientLogo.png")}
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
      ListModal: false,
      addListModal: false,
      newListName: "",
    };
    // }
  }

  componentDidMount() {
    if (this.props.couponDetails) {
      let couponId = {
        coupon_id: this.props.couponDetails.coupon_detail.coupon_id,
      };
      let _buyProducts = [];
      let _selectionProducts = [];
      this.props.couponDetails.products?.map((product) => {
        if (product.type == "buy") {
          product.quantity = false;
          _buyProducts.push(product);
        }
      });
      this.props.couponDetails.products?.map((product) => {
        if (product.type == "select") {
          product.quantity = false;
          _selectionProducts.push(product);
        }
      });

      //Conditions
      // let _conditions = this.props.couponDetails.mix_and_match_conditions.conditions
      // let _splitConditions = _conditions.split(",")
      // let _buyConditionMessages = []
      // let _buyConditions = []
      // _splitConditions.map((condition) => {
      //   let _splitCondition = condition.split("-")
      //   let _message = 'Buy '+_splitCondition[0]+' quantity of any '+ _splitCondition[1]+' product(s)!'
      //   _buyConditionMessages.push(_message)
      //   _buyCondition = {buy:_splitCondition[0], product: _splitCondition[1],fulfilled:false}
      //   _buyConditions.push(_buyCondition)
      // })

      // console.log('split conditions',_splitConditions)
      let _buyCondition = {
        choose: this.props.couponDetails.mix_and_match_conditions.buy_quantity,
        fulfilled: false,
      };
      let _buyConditionMessage =
        "Choose any " +
        this.props.couponDetails.mix_and_match_conditions.selection_quantity +
        " of the product(s)";
      let _selectConditionMessage =
        "Choose " +
        this.props.couponDetails.mix_and_match_conditions.selection_quantity +
        " product(s) for free!";
      let _selectionCondition = {
        choose: this.props.couponDetails.mix_and_match_conditions
          .selection_quantity,
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
        if (product.quantity) {
          let _product = {
            product_id: product.product_id,
            type: "buy",
            quantity: 1,
          };
          _products.push(_product);
        }
      });
      this.state.bundleData.selectionProducts.map((product) => {
        if (product.quantity) {
          let _product = {
            product_id: product.product_id,
            type: "select",
            quantity: 1,
          };
          _products.push(_product);
        }
      });

      let _bundleData = {
        coupon_id: this.state.bundleData.coupon_id,
        products: _products,
      };

      if (!this.props.activeList) {
        this.setState({ bottomDrop: true });
      } else {
        if (coupon_id) {
          var addParams = {
            list_id: this.props.activeList,
            bundleData: _bundleData,
          };
          this.props.addListBundle(addParams);
          this.props.navigation.navigate("CategoryList", {
            routeName: "shopBundleScreen",
          });
        }
      }
    }
  }
  currencyFormat(num) {
    return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  onAddQuantity = (index) => {
    const _bundleData = { ...this.state.bundleData };
    const _products = [..._bundleData.buyProducts];
    let _product = { ..._products[index] };
    _product.quantity = !_product.quantity;
    _products[index] = _product;
    _bundleData.buyProducts = _products;
    this.setState({ bundleData: _bundleData }, () => {
      this._validate();
      console.log("on Add Quantity", this.state.bundleData);
    });
  };
  onPressChooseProducts(index) {
    let _bundleData = { ...this.state.bundleData };
    console.log("bundle data after selection", _bundleData);
    let _products = [..._bundleData.selectionProducts];
    let _product = { ..._products[index] };
    _product.quantity = !_product.quantity;
    _products[index] = _product;
    _bundleData.selectionProducts = _products;
    this.setState({ bundleData: _bundleData }, () => {
      console.log("on choose Quantity", this.state.bundleData);
      this._validate();
    });
  }
  _validate = () => {
    let _bundleData = { ...this.state.bundleData };
    let _counter = 0;
    _bundleData.buyProducts.map((product) => {
      if (product.quantity) {
        _counter += _counter + 1;
      }
    });
    console.log("_counter", _counter);
    if (_counter >= _bundleData.buyCondition.choose) {
      _bundleData.buyCondition.fulfilled = true;
      _bundleData.buyConditionsMessage = "deselect to choose other options";
      this.setState({ selectionAreaVisible: true });
    } else {
      _bundleData.buyCondition.fulfilled = false;
      _bundleData.buyConditionsMessage = "Choose 1 to buy!";
    }

    let _selectCounter = 0;
    _bundleData.selectionProducts.map((product) => {
      if (product.quantity) {
        _selectCounter += _selectCounter + 1;
      }
    });
    if (_selectCounter >= _bundleData.selectionCondition.choose) {
      _bundleData.selectionCondition.fulfilled = true;
      _bundleData.selectConditionMessage = "deselect to choose other options";
    } else {
      _bundleData.selectionCondition.fulfilled = false;
      _bundleData.selectConditionMessage =
        "Choose " +
        _bundleData.selectionCondition.choose +
        " product(s) for free!";
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

  onCreateNewObject = () => {
    if (this.state.newListName) {
      var addParams = {
        name: this.state.newListName,
        user_id: 2,
      };
      this.props.addNewObjectListBackend(addParams);
    }
    this.setState({ addListModal: false });
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

  showListModal() {
    this.setState({ ListModal: !this.state.ListModal });
  }

  render() {
    return (
      <>
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
                  source={require("../../../assets/arrow-left-white.png")}
                />
              </TouchableOpacity>
              <Text style={styles.h1ListTitle}>Coupon Detail</Text>
            </View>
          </View>
          {this.props.couponDetails != null ? (
            moment(this.props.couponDetails.coupon_detail.end_date).format(
              "YYYY-MM-DD"
            ) > moment().format("YYYY-MM-DD") ? (
              <SafeAreaView>
                <View style={styles.couponDetailContainer}>
                  <View
                    style={{ flexDirection: "row", alignItems: "flex-start" }}
                  >
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Image
                        style={{
                          width: util.WP(30),
                          height: util.WP(30),
                          resizeMode: "contain",
                        }}
                        source={
                          this.props.couponDetails.coupon_detail.image
                            ? {
                                uri: this.props.couponDetails.coupon_detail
                                  .image,
                              }
                            : require("../../../assets/no-image.png")
                        }
                      />
                    </View>
                    <View style={styles.couponTitleContainer}>
                      <Text style={{ ...styles.h1SubTitle, flex: 0.7 }}>
                        {this.props.couponDetails.coupon_detail.title}
                      </Text>
                    </View>
                  </View>

                  {this.state.switchValue ? (
                    <View style={styles.couponBarcodeContainer}>
                      <Barcode
                        value={this.props.couponDetails.coupon_detail.barcode}
                        height={60}
                        lineColor="#FB7300"
                        format={
                          this.props.couponDetails.coupon_detail.barcode
                            .length === 13
                            ? "EAN13"
                            : "UPC"
                        }
                        flat
                      />
                    </View>
                  ) : (
                    <View />
                  )}

                  <Text style={styles.couponItemDescription}>
                    {this.props.couponDetails.coupon_detail.description}
                  </Text>

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
                    {this.props.couponDetails.coupon_detail.type ==
                    "mix_and_match" ? (
                      this.props.couponDetails.coupon_detail
                        .mix_and_match_type == "different_cost_products" ? (
                        <View style={{ marginTop: 10 }}>
                          <View>
                            <View>
                              <Text>
                                *
                                {this.state.bundleData
                                  ? this.state.bundleData.buyConditionsMessage
                                  : ""}
                              </Text>
                            </View>
                            <View>
                              {this.state.bundleData &&
                                this.state.bundleData.buyProducts?.map(
                                  (product, index) => {
                                    return product.type == "buy" ? (
                                      <TouchableOpacity
                                        onPress={() =>
                                          this.state.bundleData.buyCondition
                                            .fulfilled
                                            ? product.quantity
                                              ? this.onAddQuantity(index)
                                              : ""
                                            : this.onAddQuantity(index)
                                        }
                                        key={product.name}
                                      >
                                        <View
                                          style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            borderBottomWidth: 0.5,
                                            borderColor: "#ccc",
                                            paddingHorizontal: 5,
                                            paddingVertical: 5,
                                            backgroundColor: "#fff",
                                            marginTop: 5,
                                            opacity: this.state.bundleData
                                              .buyCondition.fulfilled
                                              ? product.quantity
                                                ? 1
                                                : 0.2
                                              : 1,
                                          }}
                                        >
                                          <View
                                            style={{
                                              width: "70%",
                                              flexDirection: "column",
                                              justifyContent: "center",
                                            }}
                                          >
                                            <Text
                                              numberOfLines={1}
                                              style={{
                                                fontSize: 14,
                                                fontFamily:
                                                  "Montserrat-SemiBold",
                                                color: "#004678",
                                              }}
                                            >
                                              {product.name}
                                            </Text>
                                            <Text
                                              style={{
                                                fontSize: util.WP(2.5),
                                                fontFamily:
                                                  "Montserrat-regular",
                                                color: "grey",
                                              }}
                                            >
                                              ${product.price}
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
                                            {product.quantity && (
                                              <Image
                                                style={{
                                                  width: util.WP(10),
                                                  height: util.WP(10),
                                                  resizeMode: "contain",
                                                }}
                                                source={require("../../../assets/checkbox.png")}
                                              />
                                            )}
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    ) : null;
                                  }
                                )}
                            </View>
                          </View>

                          <View
                            style={{
                              marginTop: 10,
                              opacity: this.state.selectionAreaVisible
                                ? 1
                                : 0.2,
                            }}
                          >
                            <View>
                              <Text>
                                {this.state.bundleData
                                  ? this.state.bundleData.selectConditionMessage
                                  : ""}
                              </Text>
                            </View>
                            <View>
                              {/*Free Selection Products*/}
                              {this.state.bundleData &&
                                this.state.bundleData.selectionProducts.map(
                                  (product, index) => {
                                    return product.type == "select" ? (
                                      <TouchableOpacity
                                        onPress={() =>
                                          this.state.bundleData
                                            .selectionCondition.fulfilled
                                            ? product.quantity
                                              ? this.onPressChooseProducts(
                                                  index
                                                )
                                              : ""
                                            : this.onPressChooseProducts(index)
                                        }
                                        key={product.name}
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
                                            // opacity: product.quanity >= 1 ? 1 : 0.5,
                                            opacity: this.state.bundleData
                                              .selectionCondition.fulfilled
                                              ? product.quantity
                                                ? 1
                                                : 0.2
                                              : 1,
                                          }}
                                        >
                                          <View
                                            style={{
                                              width: "70%",
                                              flexDirection: "column",
                                              justifyContent: "center",
                                            }}
                                          >
                                            <Text
                                              numberOfLines={1}
                                              style={{
                                                fontSize: 14,
                                                fontFamily:
                                                  "Montserrat-SemiBold",
                                                color: "#004678",
                                              }}
                                            >
                                              {product.name}
                                            </Text>
                                            <Text
                                              style={{
                                                fontSize: util.WP(2.5),
                                                fontFamily:
                                                  "Montserrat-regular",
                                                color: "grey",
                                              }}
                                            >
                                              ${product.price}
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
                                            {product.quantity >= 1 && (
                                              <Image
                                                style={{
                                                  width: util.WP(10),
                                                  height: util.WP(10),
                                                  resizeMode: "contain",
                                                }}
                                                source={require("../../../assets/checkbox.png")}
                                              />
                                            )}
                                          </View>
                                        </View>
                                      </TouchableOpacity>
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
                  {this.props.couponDetails?.coupon_detail?.type !==
                  "barcode" ? (
                    <TouchableOpacity
                      onPress={() => this.showListModal()}
                      style={{
                        ...styles.addToListBlue,
                        marginTop: 10,
                        marginBottom: 80,
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

        {/* add list modal */}
        {this.modalAddList()}
        {/* list modal  */}
        <Modal isVisible={this.state.ListModal}>
          <View style={styles.modalClose}>
            <TouchableOpacity
              onPress={() => this.setState({ ListModal: false })}
            >
              <Image
                style={{ height: util.WP(10), width: util.WP(10) }}
                source={require("../../../assets/close-round.png")}
              />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <View>
              <View style={{ ...styles.blueContainerSmall, width: "100%" }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginLeft: util.WP(4),
                    marginRight: util.WP(4),
                    marginTop: util.HP(3),
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontFamily: "Montserrat-Bold" }}
                  >
                    Select List to add
                  </Text>
                  <TouchableOpacity
                    style={{ paddingHorizontal: 10 }}
                    onPress={() => this.setState({ addListModal: true })}
                  >
                    <Icon name={"plus"} size={18} color={"#fff"} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ backgroundColor: "#fff" }}>
                <FlatList
                  style={{
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 20,
                    marginTop: 20,
                  }}
                  data={this.props.fetchedLists}
                  renderItem={({ item: rowData }) => {
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          borderWidth: 1,
                          borderLeftWidth: 0,
                          borderRightWidth: 0,
                          borderColor: "#F2F2F2",
                        }}
                      >
                        <TouchableOpacity
                          style={{ flexDirection: "row", alignItems: "center" }}
                          onPress={() => this.props.setActiveList(rowData.id)}
                        >
                          {this.props.activeList == rowData.id ? (
                            <Image
                              style={{ height: util.WP(7), width: util.WP(7) }}
                              source={require("../../../assets/oval-checked.png")}
                            />
                          ) : (
                            <Image
                              style={{ height: util.WP(7), width: util.WP(7) }}
                              source={require("../../../assets/oval.png")}
                            />
                          )}
                          <View style={{ ...styles.selectListView }}>
                            <Text style={styles.listName}>{rowData.name}</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                />
                <TouchableOpacity
                  style={{
                    ...styles.addToListBlue,
                    marginTop: 10,
                  }}
                  onPress={() =>
                    this.AddBundleToList(
                      this.props?.couponDetails?.coupon_detail?.coupon_id
                    )
                  }
                >
                  <Text
                    style={{
                      fontSize: util.WP("5"),
                      fontFamily: "Montserrat-SemiBold",
                      color: "#fff",
                    }}
                  >
                    Add
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </Modal>
      </>
    );
  }
}
mapStateToProps = (state) => {
  return {
    lumperShown: state.ui.isLoading,
    couponDetails: state.shop.CouponsDetails,
    cardScan: state.promotions.cardScan,
    activeList: state.Lists.activeList,
    fetchedLists: state.Lists.fetchedLists,
  };
};
mapDispatchToProps = (dispatch) => {
  return {
    toggleCardScan: (params) => dispatch(TASKS.toggleCardScan(params)),
    addListBundle: (addItemParams) =>
      dispatch(TASKS.addListBundle(addItemParams)),
    setActiveList: (id) => dispatch(TASKS.setActiveList(id)),
    addNewObjectListBackend: (addParams) =>
      dispatch(TASKS.addNewObjectListBackend(addParams)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MnmDifferentShop);
