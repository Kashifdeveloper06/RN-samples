import React, { Component, useEffect } from "react";
import {
  StatusBar,
  AppState,
  PermissionsAndroid,
  Image,
  FlatList,
  Button,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Linking,
} from "react-native";
import { Card } from "react-native-elements";
import { styles } from "../../../styles";
import Icon from "react-native-vector-icons/FontAwesome5";
import Swiper from "react-native-swiper";
import RNLocation from "react-native-location";
import { connect } from "react-redux";
import * as util from "../../../utilities";
import Modal from "react-native-modal";
import moment from "moment";
import * as TASKS from "../../../store/actions";
import * as geolib from "geolib";
// import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import SVGCardBaseLogo from "../../client-card/components/CardBaseLogo";
import OneSignal from "react-native-onesignal";
import analytics from "@react-native-firebase/analytics";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import FastImage from "react-native-fast-image";

const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBar.currentHeight;

class Home extends React.Component {
  static navigationOptions = ({ navigation }) => ({
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
      stores: "",
      daysCharacters: [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ],
      dayNumeric: new Date().getDay(),
      currentHour: new Date().getHours(),
      currentMinute: new Date().getMinutes(),
      currentTime: new Date().getHours() + ":" + new Date().getMinutes(),
      nearestStore: {},
      region: null,
      promotions: this.props.promotions,
      offers: this.props.promProducts,
      featuredCoupons: this.props.featuredCoupons,
      beaconsStake: "",
      fetching: false,
      openModal: true,
      isMounted: false,
      appState: AppState.currentState,
      currentCountry: "",
      country_items: [
        { label: "Trinidad and Tobago", value: "TT" },
        { label: "Saint Lucia", value: "LC" },
        { label: "Guyana", value: "GY" },
        { label: "Barbados", value: "BB" },
        { label: "Saint Vincent and the Grenadines", value: "VC" },
        { label: "Pakistan", value: "PK" },
      ],
    };
    this.screenanalytics();
    OneSignal.addEventListener("received", this.onReceived);
    OneSignal.addEventListener("opened", this.onOpened);
  }
  async screenanalytics() {
    await analytics().logScreenView({ screen_name: "HomeScreen" });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isMounted !== this.state.isMounted && !this.state.isMounted) {
      setTimeout(() => {
        this.setState({ isMounted: true });
      }, 3000);
    }
    if (
      JSON.stringify(prevProps.promotions) !=
        JSON.stringify(this.props.promotions) &&
      this.props.promotions
    ) {
      let _promotions = [];
      this.props.promotions.map((promotion) => {
        if (
          moment(promotion.end_date).format("YYYY-MM-DD") >
          moment().format("YYYY-MM-DD")
        ) {
          _promotions.push(promotion);
        }
      });
      this.setState({ promotions: _promotions });
    }
    if (
      JSON.stringify(prevProps.featuredCoupons) !=
      JSON.stringify(this.props.featuredCoupons)
    ) {
      this.setState({ featuredCoupons: this.props.featuredCoupons });
    }
    if (
      JSON.stringify(prevProps.promProducts) !=
      JSON.stringify(this.props.promProducts)
    ) {
      this.setState({ offers: this.props.promProducts });
    }
  }
  componentDidMount() {
    this.setState({ stores: this.props.clientStores });
    if (this.props.user) {
      // this.setState({ currentCountry: this.props.user.user_info.country });
      AppState.addEventListener("change", this._handleAppStateChange);
      if (!util.Interceptor.getToken()) {
        if (this.props.user.token) {
          util.Interceptor.setToken(this.props.user.token);
        } else {
          console.log("notAuthorised");
        }
      }
      if (
        this.props.user.is_connected &&
        (this.props.user.clientcard && this.props.user.clientcard.card_loyalty)
      ) {
        this.props.fetchCardPoints(this.props.user.clientcard.card_loyalty);
      }

      if (this.props.promotions) {
        let _promotions = [];
        this.props.promotions.map((promotion) => {
          if (
            moment(promotion.end_date).format("YYYY-MM-DD") >
            moment().format("YYYY-MM-DD")
          ) {
            _promotions.push(promotion);
          }
        });
        this.setState({ promotions: _promotions });
      }

      // Focus Listner to make subsequent API calls
      this.willFocusListner = this.props.navigation.addListener(
        "willFocus",
        () => {
          this.setState({
            dayNumeric: new Date().getDay(),
            currentHour: new Date().getHours(),
            currentMinute: new Date().getMinutes(),
            currentTime: new Date().getHours() + ":" + new Date().getMinutes(),
          });
          this.props.fetchLists();
          this.fetchPromotions();
          this.getFeaturedCoupons();
          this.fetchMlsStatus();
          this.props.getNotifications();
          if (
            this.props.user.is_connected &&
            (this.props.user.clientcard &&
              this.props.user.clientcard.card_loyalty)
          ) {
            this.props.fetchCardPoints(this.props.user.clientcard.card_loyalty);
          }
          this.getLiveLocation();
        }
      );
    } else if (this.props.isGuestUser) {
      //this.fetchPromotions()
      this.getLiveLocation();
      setTimeout(() => {
        this.setState({ isMounted: true });
      }, 2000);
    }

    //Pause for 2 seconds before showing content
    setTimeout(() => {
      this.setState({ isMounted: true });
    }, 2000);
  }

  getLiveLocation = () => {
    RNLocation.checkPermission({
      // this function checks for permissions
      ios: "whenInUse", // or 'always'
      android: {
        detail: "coarse", // or 'fine'
      },
    }).then((permission) => {
      if (permission) {
        RNLocation.getLatestLocation({ timeout: 60000 }).then(
          (latestLocation) => {
            this.setState({
              region: {
                latitude: latestLocation.latitude,
                longitude: latestLocation.longitude,
                latitudeDelta: 0.04,
                longitudeDelta: 0.04,
              },
            });
            // this.getCountryFromCordinates(
            //   latestLocation.latitude,
            //   latestLocation.longitude
            // );
          }
        );
      } else {
        //guest user addition
        this.setState({ region: null });
        //this.props.storeCountry('');
      }
    });

    // }
  };

  fetchMlsStatus = () => {
    this.props.getMlsStatus();
  };
  componentWillUnmount() {
    if (this.props.user) {
      clearInterval(this._interval);
      AppState.removeEventListener("change", this._handleAppStateChange);
      this.willFocusListner.remove();
    }
    OneSignal.removeEventListener("received", this.onReceived);
    OneSignal.removeEventListener("opened", this.onOpened);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      this.setState({
        dayNumeric: new Date().getDay(),
        currentHour: new Date().getHours(),
        currentMinute: new Date().getMinutes(),
        currentTime: new Date().getHours() + ":" + new Date().getMinutes(),
      });
      // this.fetchPromotions()
      this.fetchPromotions();
      this.getFeaturedCoupons();
      this.fetchMlsStatus();
      this.props.getNotifications();
      if (
        this.props.user.is_connected &&
        (this.props.user.clientcard && this.props.user.clientcard.card_loyalty)
      ) {
        this.props.fetchCardPoints(this.props.user.clientcard.card_loyalty);
      }
      // this.getLiveLocation()
    }
    this.setState({ appState: nextAppState });
  };

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }
  onOpened = (openResult) => {
    let _payload = {
      object_id: openResult.notification.payload.additionalData.notification_id,
    };
    this.props.updateNotification(_payload);
    if (openResult.notification.payload.additionalData.object == "promotion") {
      this.navigateToPromotionDetails(
        openResult.notification.payload.additionalData.object_id
      );
    }
    if (openResult.notification.payload.additionalData.object == "coupon") {
      this.navigateToCouponDetails(
        openResult.notification.payload.additionalData.object_id
      );
    }
  };
  navigateToPromotionDetails(promo_id) {
    var params = {
      promo_id: promo_id,
    };
    util.isOnline(
      () => {
        // console.log('state promotions', this.state.promotions)
        let _type = "";
        console.log(promo_id);
        if (this.state.promotions.length !== 0) {
          this.state.promotions.map((promo) => {
            if (promo_id == promo.id) {
              _type = promo.type;
            }
          });
        }
        if (_type == "product") {
          this.props.getPromotionDetails(params);
        } else if (_type == "bundle") {
          this.props.getPromotionBundles(params);
        } else {
          console.log("error with Promo type");
        }
      },
      () => {
        util.showToast(util.INTERNET_CONNECTION_ERROR);
      }
    );
  }

  selectListToAdd(product_id) {
    if (this.props.isGuestUser) {
      Alert.alert(
        "Authentication Required",
        "Please login or register to use this feature!",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Login",
            onPress: () => this.props.navigation.navigate("Login"),
          },
        ],
        { cancelable: false }
      );
    } else {
      var productData = {
        product_id: product_id,
      };
      this.props.navigation.navigate("SelectList", {
        productData: productData,
      });
    }
  }
  fetchPromotions() {
    this.setState({ fetching: true });
    console.log("default country", this.props.defaultCountries);
    util.isOnline(
      () => {
        if (this.props.user) {
          // this.setState({ currentCountry: false });
          this.props.getPromotions(this.props.user.user_info.country);
          this.props.defaultCountries.map((country) => {
            if (this.props.user.user_info.country != "PK") {
              if (country.country_code == this.props.user.user_info.country) {
                this.setState({ currentCountry: country.name });
                return;
              }
            } else {
              this.setState({ currentCountry: "Pakistan" });
            }
          });
        } else {
          this.setState({ currentCountry: false });
        }

        setTimeout(() => {
          this.setState({ fetching: false });
        }, 1000);
      },
      () => {
        this.setState({ fetching: false });
        util.showToast(util.INTERNET_CONNECTION_ERROR);
      }
    );
  }

  getFeaturedCoupons() {
    this.setState({ fetching: true });
    util.isOnline(
      () => {
        if (this.props.user) {
          // this.setState({ currentCountry: false });
          this.props.getFeaturedCoupons(this.props.user.user_info.country);
          this.props.defaultCountries.map((country) => {
            // if (country.country_code == this.props.user.user_info.country) {
            // this.setState({ currentCountry: country.name });
            // return;
            // }
          });
        } else {
          this.setState({ currentCountry: false });
        }

        setTimeout(() => {
          this.setState({ fetching: false });
        }, 1000);
      },
      () => {
        this.setState({ fetching: false });
        util.showToast(util.INTERNET_CONNECTION_ERROR);
      }
    );
  }

  fetchNotifications = () => {
    util.isOnline(
      () => {
        this.props.getNotifications(this.props.user.user_info.country);
      },
      () => {
        util.showToast(util.INTERNET_CONNECTION_ERROR);
      }
    );
  };
  getNotificationsCount = () => {
    util.isOnline(
      () => {
        this.props.getNotificationsCount(this.props.user.user_info.country);
      },
      () => {
        util.showToast(util.INTERNET_CONNECTION_ERROR);
      }
    );
  };
  renderSwiperImages() {
    if (this.state.promotions && this.state.promotions.length) {
      if (this.state.promotions) {
        return this.state.promotions.map((promotion, index) => {
          return (
            <View key={promotion.toString()} style={styles.swiperSlide}>
              <TouchableOpacity
                onPress={() => {
                  this.navigateToPromotionDetails(promotion.id);
                }}
              >
                <FastImage
                  source={{
                    uri: promotion.image,
                    priority: FastImage.priority.normal,
                  }}
                  style={styles.swiperImage}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </TouchableOpacity>
            </View>
          );
        });
      } else {
        return (
          <View style={styles.swiperSlide}>
            <Image
              style={styles.swiperImage}
              source={{
                uri:
                  "https://cdn.dribbble.com/users/1449854/screenshots/4136663/no_data_found.png",
              }}
            />
          </View>
        );
      }
    }
  }
  renderNearestStore() {
    let storesLength = this.state.stores ? this.state.stores.length : 0;
    let nearestStore = {};
    let nearestStoreDistance = 0;
    let calledOnce = false;
    if (storesLength > 0 && this.state.region != null) {
      for (let i = 0; i < storesLength; i++) {
        if (calledOnce == false) {
          nearestStoreDistance = geolib.getDistance(this.state.region, {
            latitude: this.state.stores[i].lat,
            longitude: this.state.stores[i].lon,
          });
          calledOnce = true;
        }
        if (
          calledOnce &&
          nearestStoreDistance >
            geolib.getDistance(this.state.region, {
              latitude: this.state.stores[i].lat,
              longitude: this.state.stores[i].lon,
            }) /
              1000
        ) {
          nearestStoreDistance =
            geolib.getDistance(this.state.region, {
              latitude: this.state.stores[i].lat,
              longitude: this.state.stores[i].lon,
            }) / 1000;
          nearestStore = this.state.stores[i];
        }
      }
      if (nearestStore != null && nearestStore.store_info) {
        let _currentTime =
          ("0" + this.state.currentHour).slice(-2) +
          ":" +
          this.state.currentMinute;
        return (
          <Text
            numberOfLines={3}
            style={{
              fontSize: util.WP("2.5"),
              fontFamily: "Montserrat-Regular",
              marginTop: 2,
            }}
          >
            {_currentTime <
              nearestStore.store_info[
                `${this.state.daysCharacters[this.state.dayNumeric]}_hours_to`
              ] &&
            _currentTime >
              nearestStore.store_info[
                `${this.state.daysCharacters[this.state.dayNumeric]}_hours_from`
              ]
              ? nearestStore.name +
                " closes at " +
                this.renderTimeFormat(
                  nearestStore.store_info[
                    `${
                      this.state.daysCharacters[this.state.dayNumeric]
                    }_hours_to`
                  ]
                )
              : nearestStore.name +
                " opens at " +
                this.renderTimeFormat(
                  nearestStore.store_info[
                    `${
                      this.state.daysCharacters[this.state.dayNumeric]
                    }_hours_from`
                  ]
                )}
          </Text>
        );
      }
    } else {
      return (
        <View style={{ marginTop: 3, height: util.WP(1), width: util.WP(15) }}>
          <View style={{ alignSelf: "flex-start" }}>
            {util.Lumper({ lumper: false, size: 10 })}
          </View>
        </View>
      );
    }
  }

  renderTimeFormat(time) {
    if (time != null) {
      let H = time.substr(0, 2);
      let M = time.substr(3, 4);
      let h = H % 12 || 12;

      let ampm = H < 12 || H === 24 ? "am" : "pm";
      if (M !== "00") {
        h = h + ":" + M;
      }
      return h + ampm;
    }
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
  navigateToOfferDetails(promo_id, product_id) {
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

  askForRegister() {
    Alert.alert(
      "Authentication Required",
      "Please login or register to use this feature!",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Login",
          onPress: () => this.props.navigation.navigate("Login"),
        },
      ],
      { cancelable: false }
    );
  }
  onClickUserProfile() {
    if (this.props.isGuestUser) {
      Alert.alert(
        "Authentication Required",
        "Please login or register to use this feature!",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Login",
            onPress: () => this.props.navigation.navigate("Login"),
          },
        ],
        { cancelable: false }
      );
    } else {
      this.props.navigation.navigate("UserProfile");
    }
  }
  render() {
    console.log(this.props.defaultCountries);
    const {
      isMounted,
      promotions,
      offers,
      featuredCoupons,
      fetching,
    } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          <View
            style={{
              ...styles.yellowContainerSmall,
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                // marginTop: 2,
                width: "90%",
                marginLeft: util.WP("5"),
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  marginTop: 0,
                  width: "50%",
                  justifyContent: "flex-start",
                }}
              >
                <Text style={styles.h1Title} numberOfLines={1}>
                  Hello {this.props.user ? this.props.user.first_name : "Guest"}
                  !
                </Text>

                {this.renderNearestStore()}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.props.user
                      ? this.props.navigation.navigate("Support")
                      : this.askForRegister()
                  }
                  style={styles.headerIcons}
                >
                  <Image
                    style={{ width: util.WP(6), height: util.WP(6) }}
                    source={require("../../../../assets/question_mark.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.props.user
                      ? this.props.navigation.navigate("Notifications")
                      : this.askForRegister()
                  }
                  style={styles.headerIcons}
                >
                  <Image
                    style={{ width: util.WP(7), height: util.WP(7) }}
                    source={require("../../../../assets/notifications.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  // onPress={this.getNotificationsCount}
                  onPress={() => this.onClickUserProfile()}
                  style={[styles.headerIcons, { marginRight: 0 }]}
                >
                  <Image
                    style={{ width: util.WP(7), height: util.WP(7) }}
                    source={require("../../../../assets/user.png")}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {this.props.isGuestUser ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  bottom: 0,
                }}
              >
                {
                  <View
                    style={{
                      alignItems: "flex-start",
                      overflow: "hidden",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      marginTop:
                        util.isIphoneX() || util.isIphoneXSM()
                          ? util.WP("15")
                          : util.WP("8"),
                      backgroundColor: "#fff",
                      width: "90%",
                      height: util.WP("30"),
                      borderRadius: 16,
                    }}
                  >
                    {/*<Image style={{width:util.WP('30'),height:util.WP('30')}} source={require('../../../../assets/logoSolo.png')} />*/}
                    <SVGCardBaseLogo width={106} height={100} />

                    <View style={{ marginTop: 14, marginRight: 15 }}>
                      <Text
                        style={{ ...styles.h3Title, fontSize: util.HP("1.5") }}
                      >
                        Register to get client points
                      </Text>
                      <Text
                        style={{
                          fontSize: util.HP("1.5"),
                          fontFamily: "Montserrat-Bold",
                          color: "#FB7300",
                          textAlign: "right",
                        }}
                      />
                    </View>
                  </View>
                }
              </View>
            ) : !this.props.mlsStatus ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  bottom: 0,
                }}
              >
                {
                  <View
                    style={{
                      alignItems: "flex-start",
                      overflow: "hidden",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      // marginTop: util.WP('4'),
                      backgroundColor: "#fff",
                      width: "90%",
                      height: util.WP("24"),
                      // borderRadius: 16,
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                  >
                    {/*<Image style={{width:util.WP('30'),height:util.WP('30')}} source={require('../../../../assets/logoSolo.png')} />*/}
                    <SVGCardBaseLogo width={106} height={100} />

                    <View style={{ marginTop: 14, marginRight: 15 }}>
                      <Text style={styles.h3Title} />
                      <Text
                        style={{
                          fontSize: util.HP("1.5"),
                          fontFamily: "Montserrat-Bold",
                          color: "#FB7300",
                          textAlign: "right",
                        }}
                      />
                    </View>
                  </View>
                }
              </View>
            ) : (
              <TouchableOpacity
                // onPress={ () => this.props.navigation.navigate('CardDetail')}
                onPress={() =>
                  this.props.user.is_connected
                    ? this.props.navigation.navigate("CardDetail")
                    : this.props.navigation.navigate("ConnectCard")
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    bottom: 0,
                  }}
                >
                  {this.props.user && this.props.user.is_connected ? (
                    <View
                      style={{
                        alignItems: "flex-start",
                        overflow: "hidden",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        // marginTop:
                        //   util.isIphoneX() || util.isIphoneXSM()
                        //     ? util.WP('11')
                        //     : util.WP('12'),
                        backgroundColor: "#fff",
                        width: "90%",
                        height: util.WP("24"),
                        // borderRadius: 16,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                      }}
                    >
                      {/*<Image style={{width:util.WP('30'),height:util.WP('30')}} source={require('../../../../assets/logoSolo.png')} />*/}

                      <SVGCardBaseLogo width={106} height={100} />

                      <View style={{ marginTop: 14, marginRight: 15 }}>
                        <Text style={styles.h3Title}>client Points</Text>
                        <Text
                          style={{
                            fontSize: util.HP("3"),
                            fontFamily: "Montserrat-Bold",
                            color: "#FB7300",
                            textAlign: "right",
                          }}
                        >
                          {this.props.user.clientcard.points
                            ? this.props.user.clientcard.points
                            : 0}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View
                      style={{
                        alignItems: "flex-start",
                        overflow: "hidden",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        // marginTop:
                        //   util.isIphoneX() || util.isIphoneXSM()
                        //     ? util.WP('11')
                        //     : util.WP('12'),
                        backgroundColor: "#fff",
                        width: "90%",
                        height: util.WP("24"),
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                      }}
                    >
                      {/*<Image style={{width:util.WP('30'),height:util.WP('30')}} source={require('../../../../assets/logoSolo.png')} />*/}
                      <SVGCardBaseLogo width={106} height={100} />

                      <View style={{ marginTop: 14, marginRight: 15 }}>
                        <Text
                          style={{ ...styles.h3Title, alignSelf: "flex-end" }}
                        >
                          client Points
                        </Text>
                        <Text
                          style={{
                            fontSize: util.HP("1.5"),
                            fontFamily: "Montserrat-Bold",
                            color: "#FB7300",
                            textAlign: "right",
                          }}
                        >
                          Connect or Create Your Card
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}
          </View>
          {!this.props.isGuestUser ? (
            <View
              style={{
                marginLeft: 9,
                justifyContent: "flex-start",
                alignItems: "center",
                flexDirection: "row",
                marginBottom: 5,
                marginTop: 5,
              }}
            >
              <Text
                style={{
                  fontSize:
                    util.isIphoneX() || util.isIphoneXSM()
                      ? util.HP("1")
                      : util.HP("1.6"),
                  fontFamily: "Montserrat-Regular",
                }}
              >
                Offers and Discounts in:
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: util.HP("2"),
                  fontFamily: "Montserrat-Bold",
                  color: "#00355F",
                }}
              >
                {this.state.currentCountry &&
                this.state.currentCountry.length <= 19
                  ? this.state.currentCountry
                  : this.state.currentCountry + "..."}
              </Text>
              {fetching ? (
                util.Lumper({ lumper: true, color: "#FB7300", size: 17 })
              ) : (
                <Text />
              )}
            </View>
          ) : (
            <View />
          )}
          {isMounted &&
          !this.props.isGuestUser &&
          (promotions && promotions.length) ? (
            <Swiper
              style={{ height: promotions.length > 0 ? 235 : 0 }}
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
              loop={false}
            >
              {this.renderSwiperImages()}
            </Swiper>
          ) : (
            <View />
          )}

          {isMounted ? (
            !this.props.isGuestUser ? (
              (featuredCoupons && featuredCoupons.length) ||
              (offers && offers.length) ? (
                <View>
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.h2Title}>
                        {featuredCoupons && featuredCoupons.length > 0
                          ? "Specials"
                          : ""}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate("savings", {
                            tab: "coupons",
                          })
                        }
                      >
                        <Text style={styles.viewAll}>
                          {featuredCoupons && featuredCoupons.length > 0
                            ? "View All"
                            : ""}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <FlatList
                      style={{ marginLeft: 18, marginBottom: 30 }}
                      horizontal
                      data={featuredCoupons}
                      showsHorizontalScrollIndicator={false}
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
                                height: "auto",
                                paddingBottom: 12,
                                paddingTop: 5,
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
                                  {/* <Image  style={styles.cardImage} source={require('../../../../assets/offer-item-image.png')} /> */}
                                  <FastImage
                                    source={{
                                      uri: rowData.image,

                                      priority: FastImage.priority.normal,
                                    }}
                                    style={{
                                      width: "100%",
                                      height: util.WP(22),
                                      resizeMode: "cover",
                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                  />
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                  <Text
                                    numberOfLines={2}
                                    style={[
                                      styles.h1Title,
                                      {
                                        fontSize: util.WP(3.2),
                                        minHeight: util.WP(11.5),
                                      },
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
                  </View>

                  {offers && offers.length ? (
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.h2Title}>Top Offers</Text>
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate("savings", {
                              tab: "promotions",
                            })
                          }
                        >
                          <Text style={styles.viewAll}>View All</Text>
                        </TouchableOpacity>
                      </View>
                      <FlatList
                        style={{ marginLeft: 18, marginBottom: 30 }}
                        horizontal
                        data={offers}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item: rowData }) => {
                          return (
                            <TouchableOpacity
                              //onPress={ () => navigation.navigate('OfferDetail')}
                              onPress={() =>
                                this.navigateToOfferDetails(
                                  rowData.promo_id,
                                  rowData.id
                                )
                              }
                            >
                              <Card
                                title={null}
                                containerStyle={styles.offerCard}
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
                                    {rowData.unit_retail <
                                      rowData.regular_retail && (
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
                                    <Text
                                      numberOfLines={2}
                                      style={styles.cardDetail}
                                    >
                                      {rowData.name.trim()}
                                    </Text>
                                  </View>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.selectListToAdd(rowData.id)
                                    }
                                    style={styles.addToList}
                                  >
                                    <Text
                                      style={{
                                        fontSize: util.HP("1.3"),
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
                    </View>
                  ) : (
                    <View />
                  )}
                </View>
              ) : (
                <View style={styles.containerWhite}>
                  <View style={styles.loader}>
                    <Text style={styles.noDataText}>
                      No active Offers or Coupons found!
                    </Text>
                  </View>
                </View>
              )
            ) : (
              <View style={styles.containerWhite}>
                <View style={styles.loader}>
                  <Text style={styles.noDataText}>
                    Register to unlock exclusive coupons, promotions and top
                    offers!
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
            )
          ) : (
            <View style={styles.containerWhite}>
              <View style={styles.loader}>
                <Text style={styles.noDataText}>
                  Loading Promotions and Coupons
                </Text>
                <Image
                  style={{
                    width: util.WP(75),
                    height: util.HP(23),
                    bottom: util.HP(5),
                  }}
                  source={require("../../../../assets/clientBrand.gif")}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}
mapStateToProps = (state) => {
  return {
    //lumperShown: state.ui.isLoading,
    promotions: state.promotions.promotions,
    featuredCoupons: state.promotions.featuredCoupons,
    isGuestUser: state.login.isGuestUser,
    defaultCountries: state.login.defaultCountries,
    promProducts: state.promotions.promProducts,
    user: state.login.user,
    country: state.login.country,
    clientStores: state.login.stores,
    mlsStatus: state.login.mlsStatus,
  };
};
mapDispatchToProps = (dispatch) => {
  return {
    showLoader: () => dispatch(TASKS.showLoader()),
    hideLoader: () => dispatch(TASKS.hideLoader()),
    getPromotionDetails: (params) => dispatch(TASKS.promotionsDetails(params)),
    getPromotionBundles: (params) =>
      dispatch(TASKS.getPromotionBundles(params)),
    getPromotions: (country) => dispatch(TASKS.fetchPromotions(country)),
    guestHome: (country) => dispatch(TASKS.guestHome(country)),
    getNotifications: (country) => dispatch(TASKS.fetchNotifications(country)),
    getOfferDetails: (params) => dispatch(TASKS.getOfferDetails(params)),
    getCouponDetails: (params) => dispatch(TASKS.getCouponDetails(params)),
    // getNotificationsCount: (country) => dispatch(TASKS.getNotificationsCount(country)),
    getMlsStatus: () => dispatch(TASKS.getMlsStatus()),
    fetchLists: () => dispatch(TASKS.fetchLists()),
    fetchCardPoints: (card_loyalty) =>
      dispatch(TASKS.fetchCardPoints(card_loyalty)),
    updateNotification: (country) =>
      dispatch(TASKS.updateNotification(country)),
    storeCountry: (country) => dispatch(TASKS.storeCountry(country)),
    getFeaturedCoupons: (country) =>
      dispatch(TASKS.getFeaturedCoupons(country)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
