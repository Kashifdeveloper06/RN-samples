import React, { Component } from "react";
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
import * as util from "../../../utilities";
import { styles } from "../../../styles";
import Promotions from "./promotions";
import MyCoupons from "./coupons";
import analytics from "@react-native-firebase/analytics";

export default class Settings extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <Image
        style={styles.parentHeaderLogo}
        resizeMode="contain"
        source={require("../../../../assets/Logo.png")}
      />
    ),
  });

  _renderLabel = (props) => {
    return (
      <Text
        style={{
          fontFamily: "Montserrat-Bold",
          fontSize: props.focused
            ? util.isIphoneX() || util.isIphoneXSM()
              ? util.WP("3.5")
              : util.WP("3.5")
            : util.WP("3.5"),
          color: "#fff",
          textAlign: props.route.key == "promotions" ? "left" : "right",
          alignItems: "center",
          opacity: props.focused ? 1 : 0.6,
          width: Dimensions.get("window").width / 2,
          height: props.focused ? 24 : 30,
          paddingTop: props.focused ? 0 : 3,
          paddingLeft: props.route.key == "promotions" ? 20 : 0,
          paddingRight: props.route.key == "promotions" ? 0 : 20,
          justifyContent: "center",
        }}
      >
        {props.route.title}
      </Text>
    );
  };
  _renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        indicatorStyle={{
          backgroundColor: "white",
          height: 4,
          //width:56,
        }}
        style={{ backgroundColor: "#F58220", height: util.WP(12) }}
        tabStyle={{
          flex: 1,
          align: "center",
        }}
        renderLabel={this._renderLabel}
      />
    );
  };
  renderScene = ({ route }) => {
    switch (route.key) {
      case "promotions":
        return <Promotions navigation={this.props.navigation} />;
      case "coupons":
        return <MyCoupons navigation={this.props.navigation} />;
      default:
        return null;
    }
  };
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      isMounted: false,
      routes: [
        { key: "promotions", title: "Promotions" },
        { key: "coupons", title: "Discounts" },
      ],
    };
    this.screenanalytics();
  }
  async screenanalytics() {
    // await analytics().setCurrentScreen('SavingScreen', 'SavingScreen');
    await analytics().logScreenView({ screen_name: "SavingScreen" });
  }
  componentDidMount() {
    let _tab = this.props.navigation.dangerouslyGetParent().getParam("tab");
    if (_tab == "coupons") {
      this.setState({ index: 1 });
    } else if (_tab == "promotions") {
      this.setState({ index: 0 });
    } else {
      this.setState({ index: 0 });
    }

    this.willFocusListener = this.props.navigation.addListener(
      "willFocus",
      () => {
        let _tab = this.props.navigation.dangerouslyGetParent().getParam("tab");
        if (_tab == "coupons") {
          this.setState({ index: 1 });
        } else if (_tab == "promotions") {
          this.setState({ index: 0 });
        } else {
          this.setState({ index: 0 });
        }
      }
    );

    this.setState({ isMounted: true });
  }
  componentWillUnmount() {
    this.willFocusListener.remove();
  }
  render() {

    return this.state.isMounted ? (
      // <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>

      <TabView
        navigationState={this.state}
        renderScene={this.renderScene}
        renderTabBar={this._renderTabBar}
        onIndexChange={(index) => this.setState({ index })}
        initialLayout={{ width: Dimensions.get("window").width }}
      />
    ) : (
      // </ScrollView>
      <View />
    );
  }
}
