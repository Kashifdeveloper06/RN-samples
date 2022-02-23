 
  /*
  ***************************************************************************************
  ***************************************************************************************
  
  This is the entry compoenent of the app. This compoenent checks if user is logged in
  to allow user entry to main app's Home component. It shows onBoarding screens at 
  first launch, after that everytime user lands on this screen it either opens 
  login screen or home screen.

  ***************************************************************************************
  ***************************************************************************************
  */

  import React, { Component } from 'react';
  import {Platform,StyleSheet,Text,View,StatusBar,Image ,Dimensions} from 'react-native';
  import * as util from '../../../utilities';
  // import AsyncStorage from '@react-native-async-storage/async-storage';
  import Onboarding from 'react-native-onboarding-swiper';
  import RNLocation from 'react-native-location';
  import { styles } from '../../../styles';
  import OneSignal from 'react-native-onesignal';
  import * as Util from '../../../utilities';
  import { connect } from 'react-redux';
  import * as TASKS from '../../../store/actions';

  // On Boarding screen buttons
  const Skip = ({...props}) => (
    <Text style={{fontSize: 16,fontFamily:'Montserrat-SemiBold',color:'#00355F',paddingLeft:41}}{...props}>SKIP</Text>
    );
  const Next = ({...props}) => (
    <Text style={{fontSize: 16,fontFamily:'Montserrat-SemiBold',color:'#FB7300',paddingRight:41}} {...props}>NEXT</Text>
    );
  const Done = ({...props}) => (
    <Text style={{fontSize: 14,fontFamily:'Montserrat-SemiBold',color:'#FB7300',paddingRight:41}} {...props}>LET'S GO</Text>
    );
  const Dot = ({ selected }) => {
    let backgroundColor;
    backgroundColor = selected ? '#FB7300' : '#9D9D9D';
    return (
      <View
        style={{
          width: 7,
          height: 7,
          marginHorizontal: 3,
          borderRadius:50,
          backgroundColor,
         }}
       />
     );
  };//

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

  class onBoard extends Component {

    static navigationOptions = ({ navigation }) => ({
      header: null,
      headerMode: 'none',
      gestures: null,
      gesturesEnabled: false,
    });
    
    constructor(props) {
      super(props);

      this.state = {
        colorBg: '#004678',
        loading: false,
        lat:"",
        long:"",
      };

      // Initial request for user location
      RNLocation.configure({ distanceFilter: 1.0 });
      RNLocation.requestPermission({
        ios: 'whenInUse',
        android: {
          detail: 'coarse', // or 'fine'
          rationale: {
            title: "We need to access your location",
            message: "We use your location to show where you are on the map",
            buttonPositive: "OK",
            buttonNegative: "Cancel"
          }
        }
      })
      
      // OneSignal package for PUSH notifications
      OneSignal.init(Util.APP_ID_ONE_SIGNAL);
      
      //Delay for 1.5 seconds before calling bootstap
      setTimeout(() => {
        this._bootStrap();
      }, 1500)

    }// End of Constructor
    
    _bootStrap () {

      if(!this.props.onboarding) { // checking if onboarding is false
        if (this.props.isGuestUser) {
          this.props.navigation.navigate('Home')
        }else{
          if(this.props.user && this.props.user.user_info.country){ // checking if user exists and country selected
            console.log('userssssss', this.props.user)
            if(this.props.user.id){
              this.props.refreshToken(this.props.user.id)
            }
          } else {
            this.props.navigation.navigate('Login')
          }
        }
      } else {
        this.setState({
          //loading: false
        });
      }

    }// end of _bootstrap action
    
    componentDidMount(){
      // if (Platform.OS === 'ios') {
      //   let options = {
      //     current_version: "1.9.21",
      //     release_note: "Today we have an app update! Please update your client Stores App.",
      //     last_force_update_version: "1.9.18",
      //     release_date: "2020-08-26",
      //     app_url: "https://apps.apple.com/tt/app/client-stores/id843770541",
      //     dateFormat:'DD-MM-YYYY',
      //     update_btn_name:"UPDATE NOW"
      //   }
      //   checkForVersion(options);
      // }else{
      //   let options = {
      //     current_version: "33",
      //     release_note: "Today we have a big app update! Please update your client Stores App.",
      //     last_force_update_version: "21",
      //     release_date: "2020-07-16",
      //     app_url: "https://play.google.com/store/apps/details?id=com.clientstores",
      //     dateFormat:'DD-MM-YYYY',
      //     update_btn_name:"UPDATE NOW"
      //   }
      //   checkForVersion(options);
      // }

      this.props.getDefaultCountries()
      this.props.getclientStores()
    }
    _routeHomeNew () {

      this.props.turnOffOnboarding();
      if(this.props.user){
          // this.fetchPromotions()
      } else {
        this.props.navigation.navigate('Login')
      }
    }
    
    onNext = (pageIndex) => {

      if (pageIndex == 1) {
        this.setState({
          colorBg: '#FB7300'
        });
      } else if(pageIndex == 2) {
        this.setState({
          colorBg: '#00B7FF'
        });
      } else {
        this.setState({
          colorBg: '#004678'
        });
      }
    }// end of on next


    fetchPromotions =() =>{
      Util.isOnline(() => {
        this.props.getPromotions(this.props.country)
      }, () => {
        Util.showToast(Util.INTERNET_CONNECTION_ERROR);
      })
    }
    
    render() {
      if (this.props.lumperShown || !this.props.onboarding) {
        return (
          <View style={{...styles.loader, justifyContent:'center', top:75}}>
            <Image 
              style={{width:'100%', height:util.HP(25), bottom:util.HP(15)}}
              source={require('../../../../assets/clientBrand.gif')}  
            />
          </View>
        )
      } else {
        return (
          <Onboarding
            pageIndexCallback={this.onNext}
            imageContainerStyles={styles.imageContain}
            containerStyles={{ borderTopColor: this.state.colorBg, borderTopWidth: SCREEN_HEIGHT / 1.7}}
            bottomBarHighlight={false}
            controlStatusBar={true}
            NextButtonComponent={Next}
            SkipButtonComponent={Skip}
            DotComponent={Dot}
            DoneButtonComponent={Done}
            onDone={() => this._routeHomeNew()}
            onSkip={() => this._routeHomeNew()}
            pages={
              [
              {
                backgroundColor: '#e5e5e5',
                image: <Image style={{height:util.WP('85'),width:util.WP('55')}} source={require('../../../../assets/onboard1.png')} />,
                title: <Text style={styles.onBoardTitle}>Simple Shopping</Text>,
                subtitle: <Text style={styles.onBoardSubTitle2}>Scan or search products to make shopping lists and share with family and friends</Text>,
              },
              {
                backgroundColor: '#e5e5e5',
                image: <Image style={{height:util.WP('85'),width:util.WP('55')}} source={require('../../../../assets/onboard2.png')} />,
                title: <Text style={styles.onBoardTitle}>Affordable Shopping</Text>,
                subtitle: <Text style={styles.onBoardSubTitle2}>Get coupons to make your shopping cheaper and scan them at checkout</Text>,
              },
              {
                backgroundColor: '#e5e5e5',
                image: <Image style={{height:util.WP('85'),width:util.WP('55')}} source={require('../../../../assets/onboard3.png')} />,
                title: <Text style={styles.onBoardTitle}>Just use your Phone</Text>,
                subtitle: <Text style={styles.onBoardSubTitle2}>Replace your client physical card today and just use your phone</Text>,
              },
              ]
            }
          /> // onboarding
        )// end of return call
      }
    }
  
  // end of Onboarding class
  }
  
  mapStateToProps = state => {
    return {
      lumperShown: state.ui.isLoading,
      promotions:state.promotions.promotions,
      user:state.login.user,
      country:state.login.country,
      isGuestUser:state.login.isGuestUser,
      onboarding:state.login.onboarding,
      countryList:state.login.countryList
    }
  }
  mapDispatchToProps = dispatch => {
    return {
      getPromotions: (country) => dispatch(TASKS.fetchPromotions(country)),
      getDefaultCountries: () => dispatch(TASKS.getDefaultCountries()),
      getclientStores: () => dispatch(TASKS.getclientStores()),
      storeCountry: (country) => dispatch(TASKS.storeCountry(country)),
      turnOffOnboarding: () => dispatch(TASKS.turnOffOnboarding()),
      logoutUser: () => dispatch(TASKS.logoutUser()),
      refreshToken: (userId) => dispatch(TASKS.refreshToken(userId))
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(onBoard);
  