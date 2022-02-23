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
import { connect } from "react-redux";
// import moment from "moment";

import { Text, View, StatusBar } from "react-native";
class PromotionDetails extends React.Component {
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
  componentDidMount() {
    console.log("Promo", this.props.promotionsDetails);
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
        {this.props.promotionsDetails != null ? (
          <View>
            <Image
              style={{ width: "100%", height: 167 }}
              source={{
                uri: this.props.promotionsDetails.promo_detail.image,
              }}
            />
            <View style={styles.promotionDetailContainer}>
              <Text style={styles.h1TitleBreak}>
                {this.props.promotionsDetails.promo_detail != ""
                  ? this.props.promotionsDetails.promo_detail.title
                  : "No title found"}
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
                {this.props.promotionsDetails.promo_detail.end_date}
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
                {this.props.promotionsDetails.promo_detail != ""
                  ? this.props.promotionsDetails.promo_detail.description
                  : "No Details found"}
              </Text>
              <Text
                onPress={() =>
                  this.setState({ textShown: !this.state.textShown })
                }
                style={{ color: "red", fontFamily: "Montserrat-Regular" }}
              >
                {this.props.promotionsDetails.promo_detail &&
                this.props.promotionsDetails.promo_detail.description.length >
                  200
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
              data={this.props.promotionsDetails.products}
              numColumns={2}
              renderItem={({ item: rowData }) => {
                return (
                  <TouchableOpacity>
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
                            style={styles.cardImageTabs}
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
                          <Text style={styles.cardDetailTabs}>
                            {rowData.name.trim()}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.addToListTabs}
                          onPress={() =>
                            this.selectListToAdd(rowData.product_id)
                          }
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
    promotionsDetails: state.promotions.promoDetails,
  };
};
mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PromotionDetails);
