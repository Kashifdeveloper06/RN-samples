import {
  createSwitchNavigator,
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator,
} from "react-navigation";
import React from "react";
import { connect } from "react-redux";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { styles } from "../styles";
import Icon from "react-native-vector-icons/FontAwesome5";
import Login from "../features/login/components/login";
import RegisterStep1 from "../features/login/components/register-step-1";
import RegisterStep2 from "../features/login/components/register-step-2";
import Home from "../features/home/components/home";
import Notifications from "../features/home/components/notifications";
import PromotionDetails from "../features/home/components/promotion-detail";
import PromotionBundles from "../features/home/components/promotion-bundles";
import UserProfile from "../features/home/components/user-profile";
import Orders from "../features/home/components/orders";
import OrderDetails from "../features/home/components/order-details";
import PurchaseHistory from "../features/home/components/purchase-history";
import PurchaseHistoryDetail from "../features/home/components/purchase-history-detail";
import PersonalInformation from "../features/home/components/personal-information";
import ChangePassword from "../features/home/components/change-password";
import Savings from "../features/savings/components/savings";
import CouponDetail from "../features/savings/components/coupon-detail";
import OfferDetail from "../features/savings/components/offer-detail";
import Scan from "../features/scan/components/scan";
import ScanCard from "../features/scan/components/scan-card";
import ScanList from "../features/scan/components/scan-list";
import Lists from "../features/lists/components/lists";
import ListDetail from "../features/lists/components/listDetails";
import SearchLists from "../features/lists/components/search-lists";
import SelectList from "../features/lists/components/select-list";
import OrderServices from "../features/lists/components/order-services";
import OrderQuantity from "../features/lists/components/order-quantity";
import DeliveryNotices from "../features/lists/components/delivery-notices";
import OrderForm from "../features/lists/components/order-form";
import ThankYou from "../features/lists/components/thank-you";
import Stores from "../features/stores/components/stores";
import Boarding from "../features/onboarding/components/onboarding";
import ConnectCard from "../features/client-card/components/connect-card";
import CardDetail from "../features/client-card/components/card-detail";
import CardStep1 from "../features/client-card/components/card-step-1";
import CardStep2 from "../features/client-card/components/card-step-2";
import CardRedeem from "../features/client-card/components/redeem";
import CardVerification from "../features/client-card/components/verification";
import CardSuccess from "../features/client-card/components/success";
import CardPickupLocation from "../features/client-card/components/card-pickup";
import Support from "../features/home/components/Support";
import ShopNow from "../features/shop/ShopNow";
import CategoryList from "../features/shop/categoryList";
import categorySelect from "../features/shop/categorySelect";
import MnmSameProductDetail from "../features/home/components/MnmSameProductDetail";
import StdBundleDetail from "../features/home/components/StdBundleDetail";
import EditBundleSameProducts from "../features/lists/components/editBundleSameProducts";
import EditBundleDiffProducts from "../features/lists/components/EditBundleDiffProducts";
import StdBundleDetailsShop from "../features/shop/std_bundle_details";
import MnmSameBundleShop from "../features/shop/MnmsameBundleShop";
import MnmDifferentShop from "../features/shop/MnmDiffDetailsShop";

const mainStack = createStackNavigator({
  boarding: {
    screen: Boarding,
  },
});
const loginStack = createStackNavigator({
  Login: Login,
  RegisterStep1: RegisterStep1,
  RegisterStep2: RegisterStep2,
});

const HomeNavigator = createStackNavigator({
  Home: Home,
  ConnectCard: ConnectCard,
  CardStep1: CardStep1,
  CardStep2: CardStep2,
  CardVerification: CardVerification,
  CardPickupLocation: CardPickupLocation,
  CardDetail: CardDetail,
  CardRedeem: CardRedeem,
  CardSuccess: CardSuccess,
  ScanCard: ScanCard,
  Notifications: Notifications,
  PromotionDetails: PromotionDetails,
  PromotionBundles: PromotionBundles,
  UserProfile: UserProfile,
  Orders: Orders,
  OrderDetails: OrderDetails,
  PurchaseHistory: PurchaseHistory,
  PurchaseHistoryDetail: PurchaseHistoryDetail,
  PersonalInformation: PersonalInformation,
  ChangePassword: ChangePassword,
  SelectList: SelectList,
  CouponDetail: CouponDetail,
  OfferDetail: OfferDetail,
  Support: Support,
  MnmSameProductDetail: MnmSameProductDetail,
  StdBundleDetail: StdBundleDetail,
});

const SavingsNavigator = createStackNavigator({
  Savings: Savings,
  CouponDetail: CouponDetail,
  OfferDetail: OfferDetail,
  SelectList: SelectList,
});
// const ScanNavigator = createStackNavigator({
//   Scan: Scan,
// });
const ListsNavigator = createStackNavigator(
  {
    Lists: Lists,
    ListDetail: ListDetail,
    EditBundleSameProducts: EditBundleSameProducts,
    EditBundleDiffProducts: EditBundleDiffProducts,
    SearchLists: SearchLists,
    ScanList: ScanList,
    SelectList: SelectList,
    OrderServices: OrderServices,
    OrderQuantity: OrderQuantity,
    DeliveryNotices: DeliveryNotices,
    OrderForm: OrderForm,
    ThankYou: ThankYou,
  },
  {
    initialRouteName: "Lists",
  }
);

const StoresNavigator = createStackNavigator({
  Stores: Stores,
});

const ShopNavigator = createStackNavigator({
  Shop: ShopNow,
  CategoryList: CategoryList,
  categorySelect: categorySelect,
  Scan: Scan,
  SelectList: SelectList,
  StdBundleDetailsShop: StdBundleDetailsShop,
  MnmSameBundleShop: MnmSameBundleShop,
  MnmDifferentShop: MnmDifferentShop,
});

const MainTab = createBottomTabNavigator(
  {
    Home: {
      screen: HomeNavigator,
      navigationOptions: ({ navigation }) => {
        return {
          gesturesEnabled: true,
          title: "Home",
          tabBarIcon: ({ focused }) => {
            const image = focused
              ? require("../../assets/home-selected.png")
              : require("../../assets/home-icon.png");
            return <Image source={image} style={{ width: 20, height: 20 }} />;
          },
          tabBarOptions: {
            activeTintColor: "#004678",
            style: {
              height: 55,
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              shadowOpacity: 0.75,
              shadowRadius: 5,
              shadowColor: "#9E9E9E",
              shadowOffset: { height: 0, width: 0 },
            },
          },
        };
      },
    },
    savings: {
      screen: SavingsNavigator,
      navigationOptions: ({ navigation }) => {
        return {
          gesturesEnabled: true,
          title: "Savings",
          tabBarIcon: ({ focused }) => {
            const image = focused
              ? require("../../assets/savings-selected.png")
              : require("../../assets/savings-icon.png");
            return <Image source={image} style={{ width: 20, height: 20 }} />;
          },
          tabBarOptions: {
            activeTintColor: "#FF7600",
            style: {
              height: 55,
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              shadowOpacity: 0.75,
              shadowRadius: 5,
              shadowColor: "#9E9E9E",
              shadowOffset: { height: 0, width: 0 },
            },
          },
        };
      },
    },
    // scan: {
    //   screen: ScanNavigator,
    //   navigationOptions: ({ navigation }) => {
    //     return {
    //       gesturesEnabled: true,
    //       title: 'Scan',
    //       tabBarIcon: ({ focused }) => {
    //         const image = focused
    //           ? require('../../assets/scan-icon.png')
    //           : require('../../assets/scan-icon.png');
    //         return <Image source={image} style={{ width: 20, height: 20 }} />;
    //       },
    //     };
    //   },
    // },
    Shop: {
      screen: ShopNavigator,
      navigationOptions: ({ navigation }) => {
        return {
          gesturesEnabled: true,
          title: "Shop",
          tabBarIcon: ({ focused }) => {
            const image = focused
              ? require("../../assets/buy-selected.png")
              : require("../../assets/buy.png");
            return <Image source={image} style={{ width: 20, height: 20 }} />;
          },
          tabBarOptions: {
            activeTintColor: "#26ACE1",
            style: {
              height: 55,
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              shadowOpacity: 0.75,
              shadowRadius: 5,
              shadowColor: "#9E9E9E",
              shadowOffset: { height: 0, width: 0 },
            },
          },
        };
      },
    },

    lists: {
      screen: ListsNavigator,
      lazy: true,
      navigationOptions: ({ navigation }) => {
        return {
          gesturesEnabled: true,
          title: "Lists",
          tabBarIcon: ({ focused }) => {
            const image = focused
              ? require("../../assets/list-selected.png")
              : require("../../assets/list-icon.png");
            return <Image source={image} style={{ width: 20, height: 20 }} />;
          },
          tabBarOptions: {
            activeTintColor: "#004678",
            style: {
              height: 55,
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              shadowOpacity: 0.75,
              shadowRadius: 5,
              shadowColor: "#9E9E9E",
              shadowOffset: { height: 0, width: 0 },
            },
          },
        };
      },
    },
    stores: {
      screen: StoresNavigator,
      navigationOptions: ({ navigation }) => {
        return {
          gesturesEnabled: true,
          title: "Stores",
          tabBarIcon: ({ focused }) => {
            const image = focused
              ? require("../../assets/store-selected.png")
              : require("../../assets/store-icon.png");
            return <Image source={image} style={{ width: 20, height: 20 }} />;
          },
          tabBarOptions: {
            activeTintColor: "#26ACE1",
            style: {
              height: 55,
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              shadowOpacity: 0.75,
              shadowRadius: 5,
              shadowColor: "#9E9E9E",
              shadowOffset: { height: 0, width: 0 },
            },
          },
        };
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: "#004678",
      inactiveTintColor: "gray",
    },
  }
);

HomeNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  let routeName = navigation.state.routes[navigation.state.index].routeName;
  if (
    routeName == "ScanCard" ||
    routeName == "Login" ||
    routeName == "CardVerification" ||
    routeName == "ConnectCard" ||
    routeName == "CardDetail" ||
    routeName == "CardSuccess" ||
    routeName == "CardStep1" ||
    routeName == "CardRedeem" ||
    routeName == "CardPickupLocation" ||
    routeName == "CouponDetail" ||
    routeName == "CouponSameProducts" ||
    routeName == "StdBundleDetail" ||
    routeName == "MnmSameProductDetail"
  ) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};
// ScanNavigator.navigationOptions = ({ navigation }) => {
//   let tabBarVisible = true;
//   let routeName = navigation.state.routes[navigation.state.index].routeName;
//   if (routeName == 'Scan') {
//     tabBarVisible = false;
//   }
//   return {
//     tabBarVisible,
//   };
// };
ListsNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  let routeName = navigation.state.routes[navigation.state.index].routeName;
  if (
    routeName == "ListDetail" ||
    routeName == "ScanList" ||
    routeName == "OrderServices" ||
    routeName == "OrderQuantity" ||
    routeName == "DeliveryNotices" ||
    routeName == "OrderForm" ||
    routeName == "SearchLists" ||
    routeName == "ThankYou" ||
    routeName == "EditBundleDiffProducts" ||
    routeName == "EditBundleSameProducts"
  ) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

ShopNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  let routeName = navigation.state.routes[navigation.state.index].routeName;
  if (
    routeName == "CategoryList" ||
    routeName == "StdBundleDetailsShop" ||
    routeName == "MnmSameBundleShop" ||
    routeName == "MnmDifferentShop"
  ) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};

export var SwitNav = createSwitchNavigator({
  onboard: mainStack,
  login: loginStack,
  app: MainTab,
  lists: ListsNavigator,
});

// export var AllTab =  createAppContainer(SwitNav);
export var AppContainer = createAppContainer(SwitNav);

// const mapStateToProps = (state, count) => {
//   return { }
// }

// export var Main = connect(mapStateToProps)(AllTab);
