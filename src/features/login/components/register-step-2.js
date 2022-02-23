import React, { Component } from 'react';
import {
  Image,
  Keyboard,
  Dimensions,
  FlatList,
  Button,
  DatePickerAndroid,
  Platform,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Switch,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import * as DatePickerWheel from 'react-native-wheel-picker-android';
import RNPickerSelect from 'react-native-picker-select';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Card } from 'react-native-elements';
import { styles } from '../../../styles';
import * as util from '../../../utilities';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Swiper from 'react-native-swiper';
import { connect } from 'react-redux';
import * as TASKS from '../../../store/actions';
import OneSignal from 'react-native-onesignal';
import Moment from 'moment';
import { Form, TextValidator } from 'react-native-validator-form';
import SwitchSelector from 'react-native-switch-selector';
import Modal from 'react-native-modal';

const days = getAllNumbersBetween(1, 31);
const months = getAllNumbersBetween(1, 13);
const years = getAllNumbersBetween(1900, 2000);

function getAllNumbersBetween(x, y) {
  var numbers = [];
  // Set a temporary variable i to start at value x.
  // As long as the value of i is less than the value y, increment it.
  // The loop will end when i is equal to y.
  for (var i = x; i < y; i++) {
    numbers.push(i);
  }
  return numbers;
}
class RegisterStep2 extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    //header: null,
    //headerMode: 'none',
    //gestures: null,
    //gesturesEnabled: false,
    headerTitle: (
      <Image
        style={styles.parentHeaderLogo}
        resizeMode="contain"
        source={require('../../../../assets/Logo.png')}
      />
    ),
    headerLeft: null,
  });
  constructor(props) {
    super(props);
    this.state = {
      country: '',
      isCountryError: false,
      countryErrorText: '',
      player_id: '',
      city:
        this.props.facebookObj && this.props.facebookObj.location
          ? this.props.facebookObj.location.location.city
          : null,
      dob:
        this.props.facebookObj && this.props.facebookObj.birthday
          ? Moment(this.props.facebookObj.birthday).format('YYYY-MM-DD')
          : new Date(),
      show: false,
      value: '',
      isDobError: false,
      dobErrorText: '',
      switchValue: true,
      mode: 'date',
      displayFormat: 'YYYY-MM-DD',
      screenDateFormat: 'DD MMM, YYYY',
      databaseDateFormat: 'YYYY-MM-DD',
      phone: '',
      TermsModal: false,
      isPhoneError: false,
      phoneErrorText: '',
      phoneWithCountryCode: '',
      previousData: this.props.navigation.state.params.stepOneObject,
      locations: [],
      location: '',
      isFetching: false,
      locationFieldDisabled: true,
      country_items: [{ label: 'country', value: '' }],
      present_country: false,
      isCountryError: false,
      gender: '',
      isGenderError: false,
      genderErrorText: '',
    };
    OneSignal.addEventListener('ids', (device) => {
      this.setState({ player_id: device.userId });
    });
  }
  componentDidUpdate(prevProps) {
    // if (
    //   JSON.stringify(prevProps.locations) !==
    //     JSON.stringify(this.props.locations) &&
    //   this.props.locations.length > 0
    // ) {
    // console.log('got locations')
    //   let _locations = [];
    //   this.props.locations.map((location, i) => {
    //     let _location = {
    //       label: location.name,
    //       value: location.name,
    //     };
    //     _locations.push(_location);
    //   });
    //   this.setState({ locations: _locations });
    //   this.setState({ location: '' });
    //   this.setState({ locationFieldDisabled: false });
    //   this.setState({ isFetching: false });
    // }
  }
  componentWillUnmount() {
    OneSignal.removeEventListener('ids');
  }
  componentDidMount() {
    //console.log(this.props.navigation.state.params.stepOneObject)
    this.props.clearLocations()
    if (this.props.country) {
      this.props.getCountryLocations(this.props.country);
      this.setState({ country: this.props.country });
    }
    this.props.getDefaultCountries();
    if (this.props.defaultCountries && this.props.defaultCountries.length) {
      let country_Item = [];
      this.props.defaultCountries.map((country, index) => {
        let _option = {
          label: country.name,
          value: country.country_code,
        };
        country_Item.push(_option);
      });
      this.setState({
        country_items: country_Item,
      });
    }
  }
  showDateTimePicker = () => {
    // alert('showDateTimePicker');
    Keyboard.dismiss();
    this.setState({ show: true });
  };

  showAndroidDatePicker = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: new Date(2020, 4, 25),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  };
  hideDateTimePicker = () => {
    this.setState({ show: false });
  };

  handleDatePicked = (value) => {
    this.setState({ show: !this.state.show });
    this.setState({ value: value });
    // setTimeout(() => {
    //   this.hideDateTimePicker();
    // }, 250);
  };

  validateFields = () => {
    let _validFields = true;
    if (this.state.country.length < 1) {
      this.setState({
        isCountryError: true,
        countryErrorText: 'Country is required',
      });
      _validFields = false;
    }

    if (this.state.value.length < 1) {
      this.setState({
        isDobError: true,
        dobErrorText: 'Date of birth is required',
      });
      _validFields = false;
    }
    if (this.state.phone.length < 14) {
      this.setState({
        isPhoneError: true,
        phoneErrorText: 'Please Enter Phone number',
      });
      _validFields = false;
    }

    if (this.state.gender.length < 1) {
      this.setState({
        isGenderError: true,
        genderErrorText: 'Please Select Gender',
      });
      _validFields = false;
    }

    if (_validFields) {
      this.setState({
        isCountryError: false,
        countryErrorText: '',
      });
    }
    // console.log('error hai ???', this.state.isCountryError)
    // if (this.state.country == '' ) {
    //     this.setState({isCountryError:true})
    //     util.showToast("Please select your country.");
    //     return false;
    // }
    // else if (this.state.phone != '' && this.state.phone.length != 14 ) {
    //   util.showToast("Phone Number is invalid.");
    //   return false;
    // }
    // else {
    //     this.setState({isCountryError:false})
    //     return true;
    // }
    return _validFields;
  };
  // onIds(device) {
  //   //console.log('player id: ', device.userId);
  //   this.setState({player_id:device.userId})
  // }

  handleSubmit = () => {
    if (this.validateFields()) {
      util.isOnline(() => {
        var userData = {
          image: this.state.previousData.profilePic,
          user_id: this.props.user ? this.props.user.id : '',
          first_name: this.state.previousData.firstName,
          last_name: this.state.previousData.lastName,
          email: this.state.previousData.email,
          password: this.state.previousData.password,
          phone_number: this.state.phoneWithCountryCode,
          date_of_birth: this.state.value,
          city: this.state.location,
          gender: this.state.gender,
          country: this.state.country,
          player_id: this.state.player_id,
        };
        //console.log(userData)
        this.props.registerUser(userData);
      }),
        () => {
          util.showToast('No Network covergae');
        };
      //this.props.navigation.navigate('RegisterStep2',{stepOneObject:registerStepOneData})
    }
  };
  selectDob = () => {
    this.state.dob.onPressDate();
  };

  normalizeInput = (value, previousValue) => {
    if (!value) return value;
    const currentValue = value.replace(/[^\d]/g, '');
    if (value.length == 14) {
      let currentValueString = currentValue.toString();
      let phoneWithCountryCode = currentValueString;
      this.setState({ phoneWithCountryCode: phoneWithCountryCode });
    }
    if (!previousValue || value.length > previousValue.length) {
      if (currentValue.length <= 3) return currentValue;
      if (currentValue.length === 3) return `(${currentValue})`;
      if (currentValue.length <= 6)
        return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
      if (currentValue.length === 6)
        return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}-`;
      return `(${currentValue.slice(0, 3)}) ${currentValue.slice(
        3,
        6
      )}-${currentValue.slice(6, 10)}`;
    }
  };

  handleChange = (value) => {
    const normalized = this.normalizeInput(value, this.state.phone);
    this.setState({ phone: normalized });
    if (value.length > 13) {
      this.setState({
        isPhoneError: false,
        phoneErrorText: '',
      });
    } else {
      this.setState({
        isPhoneError: true,
        phoneErrorText: 'Enter complete phone number',
      });
    }
  };

  getFormattedPhoneNum = (input) => {
    let output = '(';
    input.replace(/^\D*(\d{0,3})\D*(\d{0,3})\D*(\d{0,4})/, function(
      match,
      g1,
      g2,
      g3
    ) {
      if (g1.length) {
        output += g1;
        if (g1.length == 3) {
          output += ')';
          if (g2.length) {
            output += ' ' + g2;
            if (g2.length == 3) {
              output += '-';
              if (g3.length) {
                output += g3;
              }
            }
          }
        }
      }
    });
    this.setState({ phone: output });
  };

  validatePhoneNumber = (text) => {
    let updatedNumber = this.state.phone;
    if (updatedNumber == '' || updatedNumber.length < text.length) {
      if (updatedNumber.length == 0) {
        this.setState({ phone: '+1 (' + text });
      } else if (updatedNumber.length > 4 && updatedNumber.length <= 6) {
        if (updatedNumber.length == 6) {
          this.setState({ phone: text + ') ' });
        } else {
          this.setState({ phone: text });
        }
      } else if (updatedNumber.length > 8 && updatedNumber.length < 17) {
        if (updatedNumber.length == 11) {
          this.setState({ phone: text + '-' });
        } else {
          this.setState({ phone: text });
        }
      }
    } else if (updatedNumber != '' && updatedNumber.length > text.length) {
      let newStr = updatedNumber.substring(0, updatedNumber.length - 1);
      this.setState({ phone: newStr });
    }
  };

  onCountrySelect(val) {
    if (val) {
      
      this.setState({ locationFieldDisabled: true });
      util.isOnline(
        () => {
          this.setState({ location: '' });
          this.props.getCountryLocations(val);
          
          setTimeout(() => {
            this.setState({ isFetching: false });
            this.setState({ locationFieldDisabled: false });
            
          },500)
        },
        () => {
          util.showToast('No Network...');
        }
      );
    }
  }
  onGenderSelect(value) {
    this.setState({
      gender: value,
      isGenderError: false,
      genderErrorText: '',
    });
  }
  modalTermsToggler() {
    this.setState({ TermsModal: !this.state.TermsModal });
  }
  modalTerms() {
    return (
      <Modal
        style={{ margin: 0 }}
        isVisible={this.state.TermsModal}
        animationIn="slideInUp"
        animationInTiming={200}
        backdropOpacity={0.9}
        deviceWidth={Dimensions.get('window').width}
        deviceHeight={Dimensions.get('window').height}
      >
        <View style={{ bottom: util.WP('15') }}>
          <View style={styles.modalClose}>
            <TouchableOpacity
              onPress={() => {
                this.modalTermsToggler();
              }}
            >
              <Image
                style={{ height: util.WP(10), width: util.WP(10) }}
                source={require('../../../../assets/close-round.png')}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              ...styles.smallModalContainer,
              height: util.HP(70),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={{
                  fontFamily: 'Montserrat-Bold',
                  fontSize: util.HP(2.5),
                  color: '#FB7300',
                }}
              >
                Terms & Conditions
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  marginTop: 5,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: util.HP(1.5),
                    color: '#00355F',
                  }}
                >
                  Please read these Terms and Conditions ("Terms", "Terms and
                  Conditions") carefully before using the client Stores Mobile
                  Application.
                </Text>

                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: util.HP(1.5),
                    color: '#00355F',
                    marginTop: 10,
                  }}
                >
                  These are the Terms and Conditions governing the use of this
                  Mobile Application and the agreement that operates between You
                  and client Stores. These Terms and Conditions set out the
                  rights and obligations of all users regarding the use of the
                  Mobile application.
                </Text>

                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: util.HP(1.5),
                    color: '#00355F',
                    marginTop: 10,
                  }}
                >
                  Your access to and use of the Mobile application is also
                  conditioned on Your acceptance of and compliance with the
                  Privacy Policy of the Company. Our Privacy Policy describes
                  Our policies and procedures on the collection, use, and
                  disclosure of Your personal information when You use the
                  Application or the Website and tells You about Your privacy
                  rights and how the law protects You. Please read Our Privacy
                  Policy carefully before using Our Service.
                </Text>

                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: util.HP(1.5),
                    color: '#00355F',
                    marginTop: 10,
                  }}
                >
                  Your access to and use of the Mobile application is
                  conditioned on Your acceptance of and compliance with these
                  Terms and Conditions. These Terms and Conditions apply to all
                  visitors, users and others who access or use the Mobile
                  application.
                </Text>

                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: util.HP(2),
                    color: '#FB7300',
                    marginTop: 10,
                  }}
                >
                  Links To Other Products
                </Text>

                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: util.HP(1.5),
                    color: '#00355F',
                    marginTop: 5,
                  }}
                >
                  Our Service may contain links to third-party products that are
                  not owned or controlled by client Stores.
                </Text>

                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: util.HP(1.5),
                    color: '#00355F',
                    marginTop: 10,
                  }}
                >
                  Our Service may contain links to third-party products that are
                  not owned or controlled by client Stores.
                </Text>

                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: util.HP(1.5),
                    color: '#00355F',
                    marginTop: 10,
                  }}
                >
                  client Stores has no control over and assumes no responsibility
                  for, the content, privacy policies, or practices of any third
                  party products. You further acknowledge and agree that client
                  Stores shall not be responsible or liable, directly or
                  indirectly, for any damage or loss caused or alleged to be
                  caused by or in connection with use of or reliance on any such
                  goods.
                </Text>

                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: util.HP(2),
                    color: '#FB7300',
                    marginTop: 10,
                  }}
                >
                  Termination
                </Text>

                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: util.HP(1.5),
                    color: '#00355F',
                    marginTop: 5,
                  }}
                >
                  We may terminate or suspend Your access immediately, without
                  prior notice or liability, for any reason whatsoever,
                  including without limitation if You breach these Terms and
                  Conditions. Upon termination, Your right to use the Service
                  will cease immediately.
                </Text>

                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: util.HP(2),
                    color: '#FB7300',
                    marginTop: 10,
                  }}
                >
                  Governing Law
                </Text>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: util.HP(1.5),
                    color: '#00355F',
                    marginTop: 5,
                  }}
                >
                  The laws of the Country, excluding its conflicts of law rules,
                  shall govern this Terms and Your use of the Service. Your use
                  of the Application may also be subject to other local, or
                  international laws.
                </Text>

                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: util.HP(2),
                    color: '#FB7300',
                    marginTop: 10,
                  }}
                >
                  Dispute Resolution
                </Text>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: util.HP(1.5),
                    color: '#00355F',
                    marginTop: 5,
                  }}
                >
                  If You have any concerns or disputes about the Mobile
                  Application and its service, You agree to first try to resolve
                  the dispute informally by contacting the Company.
                </Text>

                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: util.HP(2),
                    color: '#FB7300',
                    marginTop: 10,
                  }}
                >
                  Changes
                </Text>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: util.HP(1.5),
                    color: '#00355F',
                    marginTop: 5,
                  }}
                >
                  We reserve the right, at our sole discretion, to modify or
                  replace these Terms at any time. If a revision is a material
                  we will try to provide at least 30 days' notice prior to any
                  new terms taking effect. What constitutes a material change
                  will be determined at our sole discretion.
                </Text>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: util.HP(1.5),
                    color: '#00355F',
                    marginTop: 10,
                  }}
                >
                  By continuing to access or use the Mobile Application after
                  those revisions become effective, You agree to be bound by the
                  revised terms. If You do not agree to the new terms, in whole
                  or in part, please stop using the Mobile Application.
                </Text>

                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: util.HP(2),
                    color: '#FB7300',
                    marginTop: 10,
                  }}
                >
                  Contact Us
                </Text>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: util.HP(1.5),
                    color: '#00355F',
                    marginTop: 5,
                  }}
                >
                  If you have any questions about these Terms, please contact us
                  at:{' '}
                  <Text style={{ color: '#FB7300' }}>info@clientapp.com</Text>
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
  openTermsModal() {}
  render() {
    console.log(this.state.country_items);
    const { isFetching, locationFieldDisabled } = this.state;
    const{locations} = this.props
    return (
      <KeyboardAwareScrollView style={styles.container}>
        {this.modalTerms()}
        <View style={styles.yellowContainerLarge}>
          {/* <View style={styles.logoContainer}>
            <Image style={styles.headerLogo} source={require('../../../../assets/Logo.png')} />
          </View> */}
          <View
            style={{
              alignItems: 'flex-start',
              flexDirection: 'row',
              marginTop: 35,
              marginLeft: util.WP('5'),
            }}
          >
            <TouchableOpacity
              style={{ marginRight: 17 }}
              onPress={() => this.props.navigation.goBack()}
            >
              <Image
                style={{ height: util.WP(7), width: util.WP(7) }}
                source={require('../../../../assets/arrow-left.png')}
              />
            </TouchableOpacity>
            <Text style={styles.h1TitleBreak}>Just one final step</Text>
          </View>
        </View>

        <View
          style={{
            top: -util.WP('48'),
            width: '95%',
            left: 10,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              alignItems: 'stretch',
              backgroundColor: '#fff',
              justifyContent: 'center',
              flexDirection: 'column',
              marginTop: 15,
            }}
          >
            <View style={{ height:util.WP(15), width: '100%' }}>
              <View style={styles.labelInput}>
                <Text style={styles.labelTextInput}>Country</Text>
                <Text
                  style={{ ...styles.errorTextInput, alignSelf: 'flex-start' }}
                >
                  {this.state.isCountryError ? this.state.countryErrorText : ''}
                </Text>
              </View>
              <RNPickerSelect
                onValueChange={(value) => {
                  if (value && value != this.state.country) {
                    this.setState({ isCountryError: false });
                    this.setState({ countryErrorText: '' });
                    this.setState({ country: value });
                    if (Platform.OS === 'android') {
                      this.onCountrySelect(value);
                    }
                  } else {
                    this.setState({ isCountryError: true });
                    this.setState({ countryErrorText: 'Country is required' });
                  }
                }}
                onDonePress={(val) => {
                  this.onCountrySelect(this.state.country);
                }}
                disabled={this.props.lumperShown}
                //placeholder={{label: this.props.country ?this.state.countriesData[this.props.country]:'Country (Required)'}}
                //itemKey={this.props.country?this.props.country:""}
                value={this.state.country}
                placeholder={{ label: 'Select...' }}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: {
                    ...styles.textInput,
                    borderColor: this.state.isCountryError ? 'red' : '#F2F2F2',
                  },
                  inputAndroid: {
                    ...styles.textInput,
                    fontSize: 14,
                    borderColor: this.state.isCountryError ? 'red' : '#F2F2F2',
                  },
                  placeholder: {
                    color: 'black',
                    fontSize: Platform.OS === 'ios' ? 16 : 14,
                  },
                  viewContainer: {
                    paddingLeft: Platform.OS === 'android' ? 12 : 0,
                    borderColor: Platform.OS === 'ios' ? '#F2F2F2' : '#828282',
                    borderBottomWidth: 1,
                  },
                  done: { color: '#fff' },
                  modalViewMiddle: {
                    backgroundColor: '#004678',
                    fontFamily: 'Montserrat-Bold',
                    fontSize: 14,
                  },
                  modalViewBottom: { backgroundColor: '#fff', color: '#fff' },
                  iconContainer: {
                    top: 12,
                    right: 12,
                  },
                }}
                items={this.state.country_items}
                Icon={() => {
                  return (
                    <Image
                      source={require('../../../../assets/angleDown.png')}
                      style={{
                        width: 15,
                        height: 15,
                        resizeMode: 'contain',
                      }}
                    />
                  );
                }}
              />
            </View>

            <View style={{ height:util.WP(15), width: '100%', marginTop: 1 }}>
              <View style={styles.labelInput}>
                <Text style={styles.labelTextInput}>City/Area</Text>
              </View>

              <RNPickerSelect
                onValueChange={(value) => {
                  if (value && value != this.state.location) {
                    this.setState({ location: value });
                  }
                }}
                //itemKey={this.props.country?this.props.country:""}
                disabled={this.props.lumperShown}
                value={this.state.location}
                placeholder={{ label: 'Select...' }}
                useNativeAndroidPickerStyle={false}

                style={{
                  inputIOS: styles.textInput,
                  inputAndroid: { ...styles.textInput, fontSize: 14 },
                  placeholder: {
                    color: 'black',
                    fontSize: Platform.OS === 'ios' ? 16 : 14,
                  },
                  viewContainer: {
                    paddingLeft: Platform.OS === 'android' ? 12 : 0,
                    borderColor: Platform.OS === 'ios' ? '#F2F2F2' : '#828282',
                    borderBottomWidth: 1,
                  },
                  done: { color: '#fff' },
                  modalViewMiddle: {
                    backgroundColor: '#004678',
                    fontFamily: 'Montserrat-Bold',
                    fontSize: 14,
                  },
                  modalViewBottom: { backgroundColor: '#fff', color: '#fff' },
                  iconContainer: {
                    top: 12,
                    right: 12,
                  },
                }}
                items={locations ? locations : [{label:'Select...', value:''}]}
              />

              {isFetching ? (
                <View
                  style={{
                    position: 'absolute',
                    height: 50,
                    top: '30%',
                    right: 0,
                    left: 0,
                  }}
                >
                  {util.Lumper({ lumper: true, color: '#00355F', size: 15 })}
                </View>
              ) : (
                <View />
              )}
            </View>
            <View style={{ height:util.WP(15), width: '100%', marginTop: 1 }}>
              <View style={styles.labelInput}>
                <Text style={styles.labelTextInput}>Date of Birth</Text>
                <Text
                  style={{ ...styles.errorTextInput, alignSelf: 'flex-start' }}
                >
                  {this.state.isDobError ? this.state.dobErrorText : ''}
                </Text>
              </View>
              <DatePicker
                date={
                  this.state.value
                    ? Moment(this.state.value).format(
                        this.state.screenDateFormat
                      )
                    : Moment().format(this.state.screenDateFormat)
                }
                mode="date"
                placeholder="Select..."
                style={{
                  ...styles.textInputDatePicker,
                  borderColor: this.state.isDobError ? 'red' : '#F2F2F2',
                }}
                androidMode="spinner"
                format={this.state.screenDateFormat}
                minDate="01 Jan, 1925"
                maxDate="31 Dec, 2000"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={false}
                customStyles={{
                  dateInput: {
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    borderColor: '#fff',
                    fontSize: util.WP(3.5),
                    fontFamily: 'Montserrat-Light',
                  },
                  placeholderText: {
                    fontFamily: 'Montserrat-Light',
                    color: 'black',
                  },
                  datePicker: {
                    backgroundColor: '#d1d3d8',
                    justifyContent:'center'
                  },
                  btnConfirm: {
                    backgroundColor: '#004678',
                    width: '50%',
                  },
                  btnTextConfirm: {
                    color: '#fff',
                  },
                  dateText: {
                    fontFamily: 'Montserrat-Light',
                  },
                  btnCancel: {
                    backgroundColor: '#F58220',
                    width: '50%',
                  },
                  btnTextCancel: {
                    color: '#fff',
                  },
                  // ... You can check the source to find the other keys.
                }}
                onDateChange={(date) => {
                  this.setState({ value: date });
                  this.setState({
                    isDobError: false,
                    dobErrorText: '',
                  });
                }}
              />
            </View>

            <View style={{ height:util.WP(15), width: '100%', marginTop: 2 }}>
              <View style={styles.labelInput}>
                <Text style={styles.labelTextInput}>Phone number</Text>
                <Text
                  style={{ ...styles.errorTextInput, alignSelf: 'flex-start' }}
                >
                  {this.state.isPhoneError ? this.state.phoneErrorText : ''}
                </Text>
              </View>
              <TextInput
                style={{
                  ...styles.textInput,
                  fontSize: 14,
                  borderColor: this.state.isPhoneError ? 'red' : '#F2F2F2',
                }}
                placeholder={'(868)555-5555'}
                placeholderTextColor="black"
                keyboardType="phone-pad"
                returnKeyType={'next'}
                value={this.state.phone}
                // onChangeText = {(text)=>{this.setState({phone:text})}}
                onChangeText={this.handleChange}
              />
            </View>

            <View style={{ height:util.WP(15), width: '100%', marginTop: 1 }}>
              <View style={styles.labelInput}>
                <Text style={styles.labelTextInput}>Gender</Text>
                <Text
                  style={{ ...styles.errorTextInput, alignSelf: 'flex-start' }}
                >
                  {this.state.isGenderError ? this.state.genderErrorText : ''}
                </Text>
              </View>
              <SwitchSelector
                initial={-1}
                onPress={(value) => this.onGenderSelect(value)}
                borderColor="#fff"
                buttonColor="#F58220"
                textStyle={{
                  color: '#828282',
                  fontFamily: 'Montserrat-Light',
                  fontSize: 14,
                }}
                selectedTextContainerStyle={{
                  backgroundColor: '#F58220',
                  borderRadius: 50,
                }}
                style={{ ...styles.textInput, width: '50%' }}
                selectedTextStyle={{
                  fontFamily: 'Montserrat-Bold',
                  fontSize: 14,
                }}
                height={35}
                hasPadding
                options={[
                  { label: 'Female', value: 'female' }, //images.feminino = require('./path_to/assets/img/feminino.png')
                  { label: 'Male', value: 'male' }, //images.masculino = require('./path_to/assets/img/masculino.png')
                ]}
              />
            </View>
          </View>

          <View
            style={{
              alignItems: 'flex-start',
              justifyContent: 'center',
              flexDirection: 'column',
              marginTop: 20,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              <View style={{ alignSelf: 'center', marginLeft: 2 }}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    color: '#00355F',
                    fontSize: util.HP(1.5),
                  }}
                >
                  By registering you agree to our{' '}
                </Text>
              </View>
              <View style={{ alignSelf: 'center' }}>
                <TouchableOpacity
                  onPress={() => this.setState({ TermsModal: true })}
                >
                  <Text
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      color: '#FB7300',
                      fontSize: util.HP(1.8),
                    }}
                  >
                    Terms & Conditions
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={{ ...styles.containerButton, marginTop: 10 }}
              onPress={() => this.handleSubmit()}
            >
              {this.props.lumperShown && !isFetching ? (
                util.Lumper({ lumper: true, color: '#fff' })
              ) : (
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Montserrat-SemiBold',
                    color: '#fff',
                  }}
                >
                  REGISTER
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
mapStateToProps = (state) => {
  return {
    lumperShown: state.ui.isLoading,
    user: state.login.user,
    country: state.login.country,
    socialObj: state.login.socialObj,
    locations: state.login.countryLocations,
    defaultCountries: state.login.defaultCountries,
  };
};
mapDispatchToProps = (dispatch) => {
  return {
    registerUser: (userData) => dispatch(TASKS.registerUser(userData)),
    getCountryLocations: (country) =>
      dispatch(TASKS.getCountryLocations(country)),
    getDefaultCountries: () => dispatch(TASKS.getDefaultCountries()),
    clearLocations:() => dispatch(TASKS.clearLocations())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterStep2);
