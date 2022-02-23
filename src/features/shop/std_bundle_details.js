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

import * as util from "../../utilities";
import * as TASKS from "../../store/actions";
import { Text, View, StatusBar } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { connect } from "react-redux";
import moment from "moment";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/FontAwesome5";
import FastImage from "react-native-fast-image";

class StdBundleDetailsShop extends React.Component {
  static navigationOptions = ({ navigation }) => ({
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
    this.state = {
      bundleData: null,
      bundleProducts: null,
      addToListDisabled: true,
      selectionAreaVisible: false,
      ListModal: false,
      addListModal: false,
      newListName: "",
    };
  }

  currencyFormat(num) {
    return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  AddBundleToList(coupon_id) {
    if (!this.props.activeList) {
      this.setState({ bottomDrop: true });
    } else {
      if (coupon_id) {
        var addParams = {
          list_id: this.props.activeList,
          bundleData: this.props.couponDetails.coupon_detail,
        };
        this.setState({ ListModal: false });
        this.props.addListBundle(addParams);
        setTimeout(()=> {
          this.props.navigation.navigate(
            this.props.navigation.state.params.routeName,
            {
              ScreenrouteName: "shopBundleScreen",
            }
          );
        },500)
      }
    }
  }

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
    console.log(this.props.fetchedLists);
    return (
      <>
        <ScrollView style={{ ...styles.containerWhite }}>
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
            <SafeAreaView>
              <View
                style={{
                  ...styles.couponDetailContainer,
                }}
              >
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
                          : require("../../../assets/no-image.png")
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
                                        source={require("../../../assets/noimage2.png")}
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
                    onPress={() => this.showListModal()}
                    style={{
                      ...styles.addToListBlue,
                      marginTop: 10,
                      marginBottom: 80,
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
    activeList: state.Lists.activeList,
    fetchedLists: state.Lists.fetchedLists,
  };
};
mapDispatchToProps = (dispatch) => {
  return {
    setActiveList: (id) => dispatch(TASKS.setActiveList(id)),
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
)(StdBundleDetailsShop);
