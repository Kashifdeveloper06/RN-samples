import React, { Component } from "react";
import * as util from "../../../utilities";
import {
  Button,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { Card } from "react-native-elements";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { styles } from "../../../styles";
import { connect } from "react-redux";
import * as TASKS from "../../../store/actions";

class Promotions extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
    headerMode: "none",
    gestures: null,
    gesturesEnabled: false,
  });
  constructor(props) {
    super(props);
  }
  selectListToAdd(product_id) {
    var productData = {
      product_id: product_id,
    };
    this.props.navigation.navigate("SelectList", { productData: productData });
  }
  navigateToSubDetails(promo_id, product_id) {
    var params = {
      promo_id: promo_id,
      product_id: product_id,
    };
    util.isOnline(
      () => {
        this.props.getOfferDetails(params);
      },
      () => {
        util.showToast(util.INTERNET_CONNECTION_ERROR);
      }
    );
  }
  render() {
    return !this.props.isGuestUser ? (
      <ScrollView>
        <FlatList
          style={{
            marginLeft: util.WP("3"),
            marginRight: util.WP("3"),
            width: util.WP("100"),
            marginTop: 30,
            flexDirection: "row",
          }}
          contentContainerStyle={{ marginTop: 0, marginBottom: 0 }}
          data={this.props.promProducts}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  textAlign: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                }}
              >
                <Text style={styles.noDataText}>No Offers Available</Text>
              </View>
            );
          }}
          numColumns={2}
          renderItem={({ item: rowData }) => {
            return (
              <TouchableOpacity
                //onPress={ () => navigation.navigate('OfferDetail')}
                onPress={() =>
                  this.navigateToSubDetails(rowData.promo_id, rowData.id)
                }
              >
                <Card title={null} containerStyle={styles.offerCardDual}>
                  <View>
                    <View
                      style={{
                        textAlign: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                      }}
                    >
                      <Image
                        style={styles.cardImage}
                        source={
                          rowData.images.length > 0
                            ? { uri: rowData.images[0] }
                            : require("../../../../assets/no-image.png")
                        }
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      {rowData.unit_retail < rowData.regular_retail && (
                        <Text
                          style={{
                            fontSize: util.WP(4),
                            fontFamily: "Montserrat-SemiBold",
                            textDecorationLine: "line-through",
                            color: "#000",
                            marginRight: 10,
                          }}
                        >
                          ${rowData.regular_retail}
                        </Text>
                      )}

                      <Text
                        style={{
                          fontSize: util.WP(4),
                          fontFamily: "Montserrat-SemiBold",
                          color: "#fc7401",
                        }}
                      >
                        ${rowData.unit_retail}
                      </Text>
                    </View>
                    <View>
                      <Text numberOfLines={2} style={styles.cardDetailTabs}>
                        {rowData.name.trim()}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => this.selectListToAdd(rowData.id)}
                      style={styles.addToListTabs}
                    >
                      <Text
                        style={{
                          fontSize: util.HP("1.7"),
                          fontFamily: "Montserrat-SemiBold",
                          color: "#00355F",
                        }}
                      >
                        Add To List
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </ScrollView>
    ) : (
      <View style={styles.containerWhite}>
        <View style={styles.loader}>
          <Text style={styles.noDataText}>
            Register to unlock exclusive promotions and top offers!
          </Text>
          <TouchableOpacity
            style={{
              ...styles.containerButton,
              width: "30%",
              padding: 10,
              marginTop: 20,
            }}
            onPress={() => this.props.navigation.navigate("Login")}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Montserrat-SemiBold",
                color: "#fff",
              }}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
mapStateToProps = (state) => {
  return {
    lumperShown: state.ui.isLoading,
    promProducts: state.promotions.promProducts,
    isGuestUser: state.login.isGuestUser,
  };
};
mapDispatchToProps = (dispatch) => {
  return {
    getOfferDetails: (params) => dispatch(TASKS.getOfferDetails(params)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Promotions);
