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
  Alert,
  Platform,
} from "react-native";
import { Card } from "react-native-elements";
import Swiper from "react-native-swiper";
import * as util from "../../../utilities";
import { styles } from "../../../styles";
import { connect } from "react-redux";
import * as TASKS from "../../../store/actions";
import Barcode from "./barcode_plugin/index";
import Icon from "react-native-vector-icons/FontAwesome5";
import SVGCardBaseLogo from "./CardBaseLogo";
import CardLogoSmall from "./CardLogoSmall";

class CardDetail extends React.Component {
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
    const isIphoneX = util.isIphoneX() ? true : false;
    this.state = {
      activeCoupons: "",
      isMounted: false,
      closeIconSrc: require("../../../../assets/close.png"),
    };
  }

  componentDidMount() {
    console.log("couons", this.props.coupons);
    if (this.props.coupons && this.props.coupons.length) {
      const _activeCoupons = [];
      this.props.coupons.map((coupon, i) => {
        if (coupon.active) {
          _activeCoupons.push(coupon);
        }
      });
      this.setState({ activeCoupons: _activeCoupons });
    }

    this.setState({ isMounted: true });
  }
  onRequestPhysicalCard() {
    this.props.setIsConnectCardRequest(false);
    this.props.getPickupLocations(this.props.user.clientcard.card_loyalty);
  }
  render() {
    return this.state.isMounted ? (
      <ScrollView style={styles.container}>
        <View
          style={{ ...styles.yellowContainerExtraLarge, height: util.WP("97") }}
        >
          {/* <View style={styles.logoContainer}>
            <Image style={styles.headerLogo} source={require('../../../../assets/Logo.png')} />
          </View> */}
          <View
            style={{
              alignItems: "flex-start",
              flexDirection: "row",
              marginTop: 35,
              marginLeft: util.WP("5"),
              height: 60,
            }}
          >
            <TouchableOpacity
              style={{ marginRight: 17 }}
              onPress={() => this.props.navigation.goBack()}
            >
              <Image
                style={{ height: util.WP(7), width: util.WP(7) }}
                source={this.state.closeIconSrc}
              />
            </TouchableOpacity>
            <Text style={styles.h1TitleBreak}>
              Scan your card at the checkout
            </Text>
          </View>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <View
              style={{
                flexDirection: "column",
                backgroundColor: "#fff",
                borderRadius: 5,
                overflow: "hidden",

                width: util.WP(90),
                height: util.WP("50"),
              }}
            >
              <View
                style={{
                  alignItems: "flex-start",
                  position: "absolute",
                  marginTop: 0,
                  top: util.isIphoneX()
                    ? util.HP("-0.75")
                    : util.isIphoneXSM()
                    ? util.HP("-0.60")
                    : util.HP("-0.87"),
                  left: util.isIphoneX() ? util.WP("0") : util.WP("0"),
                }}
              >
                <SVGCardBaseLogo width={215} height={215} />
              </View>

              <View
                style={{
                  position: "absolute",
                  flexDirection: "row",
                  top: util.isIphoneX()
                    ? util.HP("6")
                    : util.isIphoneXSM()
                    ? util.HP("6")
                    : util.HP("8"),
                  left: util.isIphoneX() ? util.WP("10") : util.WP("10"),
                  width: util.WP(85),
                }}
              >
                <Barcode
                  fontSize="30"
                  textMargin="10"
                  text={
                    this.props.user.clientcard &&
                    this.props.user.clientcard.card_loyalty
                      ? this.props.user.clientcard.card_loyalty
                      : ""
                  }
                  font="Montserrat-SemiBold"
                  height={70}
                  width={2.1}
                  style={{ backgroundColor: "#fff", flex: 1 }}
                  value={
                    this.props.user.clientcard &&
                    this.props.user.clientcard.card_loyalty
                      ? this.props.user.clientcard.card_loyalty
                      : "00000000000"
                  }
                  format="UPC"
                  flat
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "flex-start",
                width: util.WP("80"),
                marginLeft:
                  util.isIphoneX() || util.isIphoneXSM()
                    ? util.WP("5")
                    : util.WP("8"),
                marginTop: 10,
              }}
            >
              <View
                style={{
                  marginLeft: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  width: util.WP(12),
                  height: util.WP(12),
                  backgroundColor: "#fff",
                  borderRadius: util.WP(6),
                }}
              >
                <Image
                  style={{ width: 24, height: 20, alignSelf: "center" }}
                  source={require("../../../../assets/SCANNER.png")}
                />
              </View>

              <Text
                numberOfLines={6}
                style={{
                  marginLeft: 4,
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: util.WP(2.8),
                  color: "#00355F",
                }}
              >
                Ask your cashier to use their retail scanner gun to scan phone
                barcode. If the scanner does not work please show the card
                number above to your cashier.
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexDirection: "row",
            marginTop: 1,
            backgroundColor: "#FFD700",
            width: "100%",
            height: util.HP("12"),
          }}
        >
          <View style={{ marginTop: util.HP("3"), marginLeft: 15 }}>
            <Text
              style={{
                fontFamily: "Montserrat-Medium",
                fontSize: util.HP("2.1"),
                color: "#00355F",
              }}
            >
              client Points
            </Text>
            <Text
              style={{
                fontSize: util.HP("3"),
                fontFamily: "Montserrat-Bold",
                color: "#FB7300",
                textAlign: "left",
              }}
            >
              {this.props.user.clientcard && this.props.user.clientcard.points
                ? this.props.user.clientcard.points
                : "0"}
            </Text>
          </View>
          <View style={{ marginTop: util.HP("4"), marginRight: 15 }}>
            <TouchableOpacity
              style={styles.redeemButton}
              onPress={() => this.props.navigation.navigate("CardRedeem")}
            >
              <Text
                style={{
                  fontSize: util.HP("1.6"),
                  fontFamily: "Montserrat-SemiBold",
                  color: "#FB7300",
                }}
              >
                Redeem
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexDirection: "row",
            marginTop: 1,
            backgroundColor: "#FFD700",
            width: "100%",
            height: util.HP("12"),
          }}
        >
          {this.props.user.clientcard &&
          this.props.user.clientcard.crd_em_status ? (
            <View style={{ marginTop: util.HP("3"), marginLeft: 15 }}>
              <Text
                style={{
                  fontFamily: "Montserrat-Medium",
                  fontSize: util.HP("2.1"),
                  color: "#00355F",
                }}
              >
                Pickup Location
              </Text>
              <Text
                style={{
                  fontSize: util.HP("2.1"),
                  fontFamily: "Montserrat-Medium",
                  color: "#FB7300",
                  textAlign: "left",
                }}
              >
                {this.props.user.clientcard.crd_pickup_location}
              </Text>
            </View>
          ) : (
            <View style={{ marginTop: util.HP("3"), marginLeft: 15 }}>
              <Text
                style={{
                  fontFamily: "Montserrat-Medium",
                  fontSize: util.HP("2.1"),
                  color: "#00355F",
                }}
              >
                Request physical card
              </Text>
              <TouchableOpacity
                style={{ ...styles.requestEmbosedButoon, marginTop: 5 }}
                onPress={() => this.onRequestPhysicalCard()}
              >
                <Text
                  style={{
                    fontSize: util.HP("1.4"),
                    fontFamily: "Montserrat-SemiBold",
                    color: "#fff",
                  }}
                >
                  REQUEST NOW
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={{ marginTop: 20, marginLeft: 10 }}>
          <Text
            style={{
              marginLeft: 10,
              fontFamily: "Montserrat-Medium",
              fontSize: util.HP("2.6"),
              color: "#00355F",
              textAlign: "left",
            }}
          >
            {this.state.activeCoupons.length} Active Coupons
          </Text>
        </View>
        {this.state.activeCoupons && this.state.activeCoupons.length ? (
          <Swiper
            style={{ height: util.WP("78") }}
            dot={
              <View
                style={{
                  width: 7,
                  height: 7,
                  marginHorizontal: 3,
                  borderRadius: 50,
                  backgroundColor: "#9D9D9D",
                }}
              />
            }
            activeDot={
              <View
                style={{
                  width: 7,
                  height: 7,
                  marginHorizontal: 3,
                  borderRadius: 50,
                  backgroundColor: "#FB7300",
                }}
              />
            }
            horizontal
          >
            {this.renderSwiperCoupons()}
          </Swiper>
        ) : (
          <View
            style={{
              height: util.WP("40"),
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <Text style={styles.viewAll}>No Coupons Available!</Text>
          </View>
        )}
        <View
          style={{
            width: "100%",
            height: util.HP("10"),
            alignItems: "center",
            backgroundColor: "#004678",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity onPress={() => this.onRemoveCard()}>
            {this.props.lumperShown ? (
              util.Lumper({ lumper: true, color: "#fff" })
            ) : (
              <Text
                style={{
                  fontFamily: "Montserrat-Bold",
                  fontSize: util.WP("5"),
                  color: "#fff",
                }}
              >
                Remove Card
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    ) : (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  onRemoveCard() {
    Alert.alert(
      "Remove Card",
      "Are you sure you want to remove card ?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Remove", onPress: () => this.props.removeCard() },
      ],
      { cancelable: false }
    );
  }

  renderSwiperCoupons() {
    return this.state.activeCoupons.map((coupon, i) => {
      return (
        <View key={i} style={styles.swiperSlideCoupons}>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "flex-start",
              width: util.WP("60"),
              marginLeft: util.WP("5"),
            }}
          >
            <Text style={[styles.h1TitleFix]}>{coupon.title}</Text>
            <Text
              style={{
                fontSize: util.HP("1.7"),
                fontFamily: "Montserrat-Regular",
                color: "#9D9D9D",
              }}
            >
              Expires {coupon.end_date}
            </Text>
          </View>
          <View style={styles.couponSwiper}>
            {coupon.barcode.length == "13" ? (
              <Barcode
                value={coupon.barcode}
                height={60}
                lineColor="#FB7300"
                format="EAN13"
                flat
              />
            ) : (
              <Barcode
                value={coupon.barcode}
                height={60}
                lineColor="#FB7300"
                format="UPC"
                flat
              />
            )}
          </View>
        </View>
      );
    });
  }
}

mapStateToProps = (state) => {
  return {
    lumperShown: state.ui.isLoading,
    coupons: state.promotions.coupons,
    user: state.login.user,
  };
};
mapDispatchToProps = (dispatch) => {
  return {
    removeCard: () => dispatch(TASKS.removeCard()),
    getPickupLocations: (card_loyalty) =>
      dispatch(TASKS.getPickupLocations(card_loyalty)),
    setIsConnectCardRequest: (status) =>
      dispatch(TASKS.setIsConnectCardRequest(status)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardDetail);
