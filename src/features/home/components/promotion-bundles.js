import React, { Component } from "react";
import {
  Image,
  Dimensions,
  AsyncStorage,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { styles } from "../../../styles";
import { Card } from "react-native-elements";
import * as util from "../../../utilities";
import * as TASKS from "../../../store/actions";
import { connect } from "react-redux";
import moment from "moment";

import { Text, View, StatusBar } from "react-native";
class PromotionBundles extends React.Component {
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
  state = { switchValue: false, textShown: false };
  toggleSwitch = (value) => {
    this.setState({ switchValue: value });
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
  toggleNumberOfLines = (index) => {
    this.setState({
      textShown: this.state.textShown === index ? -1 : index,
    });
  };

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
    return (
      <ScrollView style={styles.container}>
        <View style={styles.lightBlueContainerSmall}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginLeft: 20,
              marginRight: 25,
              marginTop: util.HP(3),
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
            <Text style={styles.h1ListTitle}>Promotion Details</Text>
          </View>
        </View>
        {this.props.promotionBundles != null ? (
          <View>
            <Image
              style={{ width: "100%", height: 167 }}
              source={{ uri: this.props.promotionBundles.image }}
            />

            <View style={styles.promotionDetailContainer}>
              <Text style={styles.h1TitleBreak}>
                {this.props.promotionBundles.title}
              </Text>
              <Text
                style={{
                  fontSize: util.WP(3.5),
                  fontFamily: "Montserrat-Regular",
                  marginTop: 5,
                  color: "#00355F",
                }}
              >
                <Text style={{ color: "#FF7600" }}>Ends: </Text>
                {this.props.promotionBundles.end_date}
              </Text>
              {/* //Promotion End date hidden
              <Text style={{fontFamily:'Montserrat-Regular',color:'#9D9D9D',fontSize:util.WP('3.5'),marginTop:util.WP('3')}}>
                {this.props.promotionsDetails.promo_detail != "" ? 
                this.props.promotionsDetails.promo_detail.end_date 
                :"No Date found"}

              </Text>
              */}
              <Text
                numberOfLines={this.state.textShown ? undefined : 5}
                ellipsizeMode="tail"
                style={{
                  fontFamily: "Montserrat-Regular",
                  color: "#2D2D2D",
                  fontSize: util.WP("4"),
                  marginTop: util.WP("6"),
                  marginBottom: util.WP("6"),
                }}
              >
                {this.props.promotionBundles.description}
              </Text>
              <Text
                onPress={() =>
                  this.setState({ textShown: !this.state.textShown })
                }
                style={{ color: "red", fontFamily: "Montserrat-Regular" }}
              >
                {this.props.promotionBundles.description.length > 200
                  ? this.state.textShown
                    ? "read less..."
                    : "read more..."
                  : ""}
              </Text>
            </View>

            <FlatList
              style={{
                marginLeft: util.WP("3"),
                marginRight: util.WP("3"),
                width: util.WP("100"),
                marginTop: 30,
                flexDirection: "row",
              }}
              contentContainerStyle={{ marginTop: 0, marginBottom: 0 }}
              data={this.props.promotionBundles.coupons}
              numColumns={2}
              renderItem={({ item: rowData }) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      this.navigateToCouponDetails(rowData.coupon_id)
                    }
                  >
                    <Card
                      title={null}
                      containerStyle={{
                        ...styles.couponCard,
                        width: util.WP(46.5),
                        height: "auto",
                        paddingHorizontal: util.WP(2.9),
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
                          <Image
                            style={{
                              width: "100%",
                              height: util.WP(25),
                              resizeMode: "cover",
                            }}
                            source={
                              rowData.image
                                ? { uri: rowData.image }
                                : require("../../../../assets/no-image.png")
                            }
                          />
                        </View>
                        <View>
                          <Text
                            style={[
                              styles.h1Title,
                              {
                                minHeight: util.WP(12.3),
                                fontSize: util.WP(3.6),
                              },
                            ]}
                            numberOfLines={2}
                          >
                            {rowData.title.trim()}
                          </Text>
                          <Text numberOfLines={2} style={styles.cardDetail}>
                            {rowData.description}
                          </Text>
                        </View>
                      </View>
                    </Card>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item, index) => index}
            />
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
    promotions: state.promotions.promotions,
    promotionBundles: state.promotions.promotionBundles,
  };
};
mapDispatchToProps = (dispatch) => {
  return {
    getCouponDetails: (params) => dispatch(TASKS.getCouponDetails(params)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PromotionBundles);
