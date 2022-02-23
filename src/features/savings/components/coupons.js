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
import moment from "moment";
import * as TASKS from "../../../store/actions";

class MyCoupons extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
    headerMode: "none",
    gestures: null,
    gesturesEnabled: false,
  });
  constructor(props) {
    super(props);
  }
  componentDidMount(){

    this.props.getCoupons(this.props.user.user_info.country)
    this.willFocusListner = this.props.navigation.addListener(
        "willFocus",
        () => {
          this.props.getCoupons(this.props.user.user_info.country)
        })
  }
  componentWillUnmount(){
    this.willFocusListner.remove()
  }
  navigateToSubDetails(coupon_id) {
    var params = {
      coupon_id: coupon_id,
    };
    util.isOnline(
      () => {
        this.props.getCouponDetails(params);
      },
      () => {
        util.showToast(util.INTERNET_CONNECTION_ERROR);
      }
    );
  }
  navigateToCouponDetails(coupon_id) {
    var params = {
      coupon_id: coupon_id,
    };
    util.isOnline(
      () => {
        this.props.getCouponDetails(params);
      },
      () => {
        util.showToast(util.INTERNET_CONNECTION_ERROR);
      }
    );
  }
  render() {
    const { navigation, isGuestUser } = this.props;
    return !isGuestUser ? (
      <ScrollView>
        <FlatList
          style={{
            marginLeft: util.WP("3"),
            marginRight: util.WP("3"),
            width: util.WP("100"),
            marginTop: 20,
            flexDirection: "row",
          }}
          data={this.props.coupons}
          numColumns={2}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  textAlign: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                }}
              >
                <Text style={styles.noDataText}>No Discounts Available</Text>
              </View>
            );
          }}
          renderItem={({ item: rowData }) => {
            return (
              <TouchableOpacity
                onPress={() => this.navigateToCouponDetails(rowData.coupon_id)}
              >
                <Card
                  title={null}
                  containerStyle={{
                    ...styles.couponCard,
                    height: "auto",
                    paddingBottom: 6,
                    paddingTop: 5,
                    paddingHorizontal: util.WP(2.9),
                    width: util.WP(48),
                  }}
                >
                  <View>
                    <View
                      style={{
                        textAlign: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                      }}
                    >
                      {/* <Image  style={styles.cardImage} source={require('../../../../assets/offer-item-image.png')} /> */}
                      <Image
                        style={{
                          width: "100%",
                          height: util.WP(22),
                          resizeMode: "cover",
                        }}
                        source={
                          rowData.image
                            ? { uri: rowData.image }
                            : require("../../../../assets/no-image.png")
                        }
                      />
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        numberOfLines={2}
                        style={[
                          styles.h1Title,
                          { fontSize: util.WP(3.2), minHeight: util.WP(11.5) },
                        ]}
                      >
                        {rowData.title}
                      </Text>
                    </View>
                    <View>
                      <Text
                        numberOfLines={2}
                        style={{
                          ...styles.cardDetail,
                          minHeight: util.WP(11),
                          height: "auto",
                        }}
                      >
                        {rowData.short_description}
                      </Text>
                    </View>
                    {rowData.active && (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: util.WP("32"),
                          marginTop: 17,
                        }}
                      >
                        <Image
                          style={{
                            height: util.HP("2.5"),
                            width: util.HP("2.5"),
                            marginLeft: util.isIphoneX()
                              ? util.WP("1")
                              : util.isIphoneXSM()
                              ? util.WP("2")
                              : util.WP("5"),
                          }}
                          source={require("../../../../assets/checkbox.png")}
                        />
                      </View>
                    )}
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
            Register to unlock exclusive coupons!
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
    promotions: state.promotions.promotions,
    coupons: state.promotions.coupons,
    user: state.login.user,
    isGuestUser: state.login.isGuestUser,
  };
};
mapDispatchToProps = (dispatch) => {
  return {
    getCoupons: (country) => dispatch(TASKS.getCoupons(country)),
    getCouponDetails: (params) => dispatch(TASKS.getCouponDetails(params)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyCoupons);
