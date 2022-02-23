import React, { Component } from "react";
import {
  Image,
  Dimensions,
  AsyncStorage,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { styles } from "../../../styles";
import { Card } from "react-native-elements";
import * as util from "../../../utilities";
import { Text, View, StatusBar } from "react-native";
import { connect } from "react-redux";

class offerDetail extends React.Component {
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
  state = { switchValue: false };
  toggleSwitch = (value) => {
    //onValueChange of the switch this function will be called
    this.setState({ switchValue: value });
    //state changes according to switch
    //which will result in re-render the text
  };
  constructor(props) {
    super(props);
  }
  selectListToAdd(product_id) {
    var productData = {
      product_id: product_id,
    };
    this.props.navigation.navigate("SelectList", { productData: productData });
  }
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
            <Text style={styles.h1ListTitle}>Offer Details</Text>
          </View>
        </View>
        {this.props.offerDetails != null ? (
          <View style={styles.offerDetailContainer}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              {/* <Image  source={require('../../../../assets/coupon-image-1.png')} />  */}
              <Image
                style={{
                  width: util.WP(50),
                  height: util.WP(50),
                  resizeMode: "contain",
                }}
                source={
                  this.props.offerDetails.images.length > 0
                    ? { uri: this.props.offerDetails.images[0] }
                    : require("../../../../assets/no-image.png")
                }
              />
            </View>

            <View style={styles.couponTitleContainer}>
              <Text style={styles.h1SubTitle}>
                {this.props.offerDetails.promo_title
                  ? this.props.offerDetails.promo_title
                  : ""}
              </Text>
              <Image
                style={{ height: util.WP(10), width: util.WP(10) }}
                source={require("../../../../assets/offer-detail-button.png")}
              />
            </View>

            <View style={styles.OfferDetailContainer}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {this.props.offerDetails.unit_retail <
                  this.props.offerDetails.regular_retail && (
                  <Text
                    style={{
                      fontSize: util.WP(4),
                      fontFamily: "Montserrat-SemiBold",
                      textDecorationLine: "line-through",
                      color: "#000",
                      marginRight: 10,
                    }}
                  >
                    ${this.props.offerDetails.regular_retail}
                  </Text>
                )}

                <Text
                  style={{
                    fontSize: util.WP(4),
                    fontFamily: "Montserrat-SemiBold",
                    color: "#fc7401",
                  }}
                >
                  ${this.props.offerDetails.unit_retail}
                </Text>
              </View>
              <Text style={styles.h1TitleBreak}>
                {this.props.offerDetails.name}
              </Text>
              <Text style={styles.offerDetailWeight}>
                {this.props.offerDetails.size}
              </Text>
            </View>

            <Text
              numberOfLines={this.state.textShown ? undefined : 5}
              ellipsizeMode="tail"
              style={styles.couponItemDescription}
            >
              {this.props.offerDetails
                ? this.props.offerDetails.promo_description
                : "No Item Description Found"}
            </Text>
            <Text
              onPress={() =>
                this.setState({ textShown: !this.state.textShown })
              }
              style={{
                color: "red",
                marginBottom: 5,
                marginTop: 5,
                fontFamily: "Montserrat-Regular",
                marginLeft: 20,
              }}
            >
              {this.props.offerDetails &&
              this.props.offerDetails.promo_description.length > 200
                ? this.state.textShown
                  ? "read less..."
                  : "read more..."
                : ""}
            </Text>
            <TouchableOpacity
              onPress={() => this.selectListToAdd(this.props.offerDetails.id)}
              style={{ ...styles.addToListBlue, marginTop: 10 }}
            >
              <Text
                style={{
                  fontSize: util.WP("5"),
                  fontFamily: "Montserrat-SemiBold",
                  color: "#fff",
                }}
              >
                Add To List
              </Text>
            </TouchableOpacity>
          </View>
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
    offerDetails: state.promotions.offerDetails,
  };
};
mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(offerDetail);
