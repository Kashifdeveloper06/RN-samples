import React, { Component } from 'react';
import {
  Image,
  FlatList,
  Button,
  Text,
  TextInput,
  Alert,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Platform,
} from 'react-native';
import { Card } from 'react-native-elements';
import { styles } from '../../../styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Swiper from 'react-native-swiper';
import * as util from '../../../utilities';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-datepicker';
import Swipeout from 'react-native-swipeout';
import { connect } from 'react-redux';
import * as TASKS from '../../../store/actions';
import Modal from 'react-native-modal';
import Moment from 'moment';
import SwitchSelector from 'react-native-switch-selector';

class PersonalInformation extends React.Component {
  static navigationOptions = ({ navigation }) => ({
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
      first_name: this.props.user.first_name,
      isEditingFirstName: false,
      last_name: this.props.user.last_name,
      isEditingLastName: false,
      date_of_birth: this.props.user.user_info.date_of_birth
        ? this.props.user.user_info.date_of_birth
        : '',
      isSettingDob: false,
      gender: this.props.user.user_info.gender
        ? this.props.user.user_info.gender
        : '',
      isSettingGender: false,
      screenDateFormat: 'DD MMM, YYYY',
      databaseDateFormat: 'YYYY-MM-DD',
      country: this.props.user.user_info.country
        ? this.props.user.user_info.country
        : '',
      isSettingCountry: false,
      phone_number: this.props.user.user_info
        ? this.props.user.user_info.phone_number
        : '',
      isEditingPhone: false,
      changeCountryAlertModal: false,
      tempCountry: '',
      location: this.props.user.user_info.city
        ? this.props.user.user_info.city
        : '',
      isSettingLocation: false,
      locations: [],
      isFetchingLocations: false,
      isUpdating: false,
      country_items: [{ label: 'select country', value: '' }],
    };
  }

  componentDidMount() {
    
    if (this.state.country) {
      this.getCountryLocations();
    }
    if (this.props.defaultCountries && this.props.defaultCountries.length) {
      let country_Item = [];
      this.props.defaultCountries.map((country, index) => {
        let _option = {
          label: country.name,
          value: country.country_code,
        };
        country_Item.push(_option);
      });

      // let _pakiOption = {
      //   label: 'Pakistan',
      //   value: 'PK'
      // }
      // country_Item.push(_pakiOption);
      this.setState({
        country_items: country_Item,
      });
    }
  }
  getCountryLocations() {
    this.setState({ isFetchingLocations: true });
    if (this.state.country) {
      util.isOnline(() => {
        this.props.getCountryLocations(this.state.country);
        setTimeout(() => {
          this.setState({ isFetchingLocations: false });
        }, 500);
      }),
        () => {
          util.showToast(util.INTERNET_CONNECTION_ERROR);
          this.setState({ isFetchingLocations: false });
        };
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // if (
    //   JSON.stringify(prevProps.locations) !==
    //     JSON.stringify(this.props.locations) &&
    //   this.props.locations.length > 0
    // ) {
    //   let _locations = [];
    //   this.props.locations.map((location, i) => {
    //     let _location = {
    //       label: location.name,
    //       value: location.name,
    //     };
    //     _locations.push(_location);
    //   });
    //   this.setState({ locations: _locations });
    //   this.setState({ isFetchingLocations: false });
    // }
    // if (prevProps.user.user_info.country != this.props.user.user_info.country) {}
  }

  onFirstNameBlurCallBack() {
    if (
      this.state.first_name &&
      this.state.first_name !== this.props.user.first_name
    ) {
      this.setState({ isEditingFirstName: true });
      _payload = {
        table: 'users',
        key: 'first_name',
        value: this.state.first_name,
      };
      this.props.updateUserProfileInfo(_payload);
      setTimeout(() => {
        this.setState({ isEditingFirstName: false });
      }, 1000);
    }
  }

  onLastNameBlurCallBack() {
    if (
      this.state.last_name &&
      this.state.last_name !== this.props.user.last_name
    ) {
      this.setState({ isEditingLastName: true });
      _payload = {
        table: 'users',
        key: 'last_name',
        value: this.state.last_name,
      };
      this.props.updateUserProfileInfo(_payload);
      setTimeout(() => {
        this.setState({ isEditingLastName: false });
      }, 1000);
    }
  }

  onCountrySelect() {
    this.setState({ isSettingCountry: true });
    if (this.state.country) {
      let _payload = {
        table: 'user_infos',
        key: 'country',
        value: this.state.country,
      };
      this.updateUserInfo(_payload);
      setTimeout(() => {
        this.setState({ isSettingCountry: false });
        this.setState({ isSettingLocation: true });
        let _payload = {
          table: 'user_infos',
          key: 'city',
          value: 'N/A',
        };
        this.updateUserInfo(_payload);
        this.setState({ location: '' });
        this.setState({ isSettingLocation: false });
        this.getCountryLocations();
      }, 1000);
    }
  }

  onLocationSelect() {
    let val = this.state.location
    if (
      val &&
      val != this.props.user.user_info.city
    ) {
      this.setState({ isSettingLocation: true });
      let _payload = {
        table: 'user_infos',
        key: 'city',
        value: val,
      };
      this.updateUserInfo(_payload);
      setTimeout(() => {
        this.setState({ isSettingLocation: false });
      }, 1000);
    }
  }

  onGenderSelect(gender) {
    if (gender != this.state.gender) {
      this.setState({ isSettingGender: true });
      this.setState({ gender: gender });
      let _payload = {
        table: 'user_infos',
        key: 'gender',
        value: gender,
      };
      this.updateUserInfo(_payload);
      setTimeout(() => {
        this.setState({ isSettingGender: false });
      }, 1000);
    }
  }

  updateUserInfo(_payload) {
    if (_payload) {
      util.isOnline(() => {
        this.props.updateUserProfileInfo(_payload);
      }),
        () => {
          util.showToast(util.INTERNET_CONNECTION_ERROR);
        };
    }
  }
  modalCountryChange() {
    return (
      <Modal isVisible={this.state.changeCountryAlertModal}>
        <View style={{ bottom: util.WP('30') }}>
          <View style={styles.smallModalContainer}>
            <Text style={styles.modalTitle}>Change Country</Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: util.WP(2),
                borderColor: '#F2F2F2',
                borderTopWidth: 1,
                borderBottomWidth: 1,
                paddingTop: util.WP(3),
                paddingBottom: util.WP(3),
              }}
            >
              <Text
                style={{
                  fontFamily: 'Montserrat-Bold',
                  fontSize: util.WP('3'),
                  color: '#00355F',
                  textAlign: 'left',
                }}
              >
                By changing your country, you will lose your client Card and any
                promotions and coupons within this Territory. You can change
                your country anytime and re-connect your client Card.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.modalBlueButton}
              onPress={() => {
                this.setState({ changeCountryAlertModal: false });
                this.onCountrySelect();
              }}
            >
              <Text
                style={{
                  fontSize: util.WP('4'),
                  fontFamily: 'Montserrat-SemiBold',
                  color: '#fff',
                }}
              >
                Yes, change my country
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.modalBlueButton, marginTop: 5 }}
              onPress={() => {
                this.setState({ country: this.props.user.user_info.country });
                this.setState({ changeCountryAlertModal: false });
              }}
            >
              <Text
                style={{
                  fontSize: util.WP('4'),
                  fontFamily: 'Montserrat-SemiBold',
                  color: '#fff',
                }}
              >
                No, don't change
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  normalizeInput = (value, previousValue) => {
    if (!value) return value;
    const currentValue = value.replace(/[^\d]/g, '');
    if (value.length == 14) {
      let currentValueString = currentValue.toString();
      let phoneWithCountryCode = currentValueString;
      this.setState({ phone: phoneWithCountryCode });
      console.log('phoneWithCountryCode', phoneWithCountryCode);
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
    this.setState({ phone_number: normalized });
  };
  onPhoneBlurCallBack() {
    if (
      this.state.phone_number &&
      this.state.phone_number !== this.props.user.user_info.phone_number
    ) {
      this.setState({ isEditingPhone: true });
      _payload = {
        table: 'user_infos',
        key: 'phone_number',
        value: this.state.phone_number,
      };
      this.props.updateUserProfileInfo(_payload);
      setTimeout(() => {
        this.setState({ isEditingPhone: false });
      }, 1000);
    }
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.lightBlueContainerSmall}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginLeft: 20,
              marginRight: 25,
              marginTop: util.HP(3),
              marginBottom: util.HP(3),
            }}
          >
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() => this.props.navigation.goBack()}
            >
              <Image
                style={{ height: util.WP(7), width: util.WP(7) }}
                source={require('../../../../assets/arrow-left-white.png')}
              />
            </TouchableOpacity>
            <Text style={styles.h1ListTitle}>Personal Information</Text>
          </View>
        </View>
        {this.modalCountryChange()}
        <View style={{ width: util.WP('94'), marginLeft: util.WP('3') }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              marginTop: util.WP('5'),
            }}
          >
            <View style={{ height:util.WP(15), width: '100%' }}>
              <View style={styles.labelInput}>
                <Text style={styles.labelTextInput}>First name</Text>
              </View>
              <TextInput
                style={{
                  ...styles.textInput,
                  borderColor:
                    this.state.first_name.length == 0 ? 'red' : '#F2F2F2',
                }}
                placeholder={''}
                placeholderTextColor="#828282"
                value={this.state.first_name}
                onBlur={() => this.onFirstNameBlurCallBack()}
                onChangeText={(text) => this.setState({ first_name: text })}
                // editable = {this.state.isEditingFirstName}
              />
              {this.state.isEditingFirstName ? (
                <View
                  style={{
                    left: 0,
                    right: 0,
                    position: 'absolute',
                    height: 50,
                    top: '30%',
                  }}
                >
                  {util.Lumper({ lumper: true, color: '#00355F', size: 15 })}
                </View>
              ) : (
                <View />
              )}
            </View>
            <View style={{ height:util.WP(15), width: '100%' }}>
              <View style={styles.labelInput}>
                <Text style={styles.labelTextInput}>Last name</Text>
              </View>
              <TextInput
                style={{
                  ...styles.textInput,
                  borderColor:
                    this.state.last_name.length == 0 ? 'red' : '#F2F2F2',
                }}
                placeholder={''}
                placeholderTextColor="#828282"
                value={this.state.last_name}
                onBlur={() => this.onLastNameBlurCallBack()}
                onChangeText={(text) => this.setState({ last_name: text })}
                // editable = {this.state.isEditingFirstName}
              />
              {this.state.isEditingLastName ? (
                <View
                  style={{
                    left: 0,
                    right: 0,
                    position: 'absolute',
                    height: 50,
                    top: '30%',
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
              </View>
              <DatePicker
                date={
                  this.state.date_of_birth
                    ? Moment(this.state.date_of_birth).format(
                        this.state.screenDateFormat
                      )
                    : Moment().format(this.state.screenDateFormat)
                }
                mode="date"
                placeholder="Select"
                style={{
                  ...styles.datePickerInput,
                  borderColor: Platform.OS === 'ios' ? '#F2F2F2' : '#828282',
                  borderBottomWidth: 1,
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
                    fontSize: 14,
                    borderColor: '#fff',
                    fontFamily: 'Montserrat-Light',
                  },
                  placeholderText: {
                    fontFamily: 'Montserrat-Light',
                    fontSize: Platform.OS === 'ios' ? 18 : 18,
                    color: 'black',
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
                    fontSize: Platform.OS === 'ios' ? 16 : 14,
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
                  this.setState({ isSettingDob: true });
                  this.setState({ date_of_birth: date });
                  let _payload = {
                    table: 'user_infos',
                    key: 'date_of_birth',
                    value: date,
                  };
                  this.props.updateUserProfileInfo(_payload);
                  setTimeout(() => {
                    this.setState({ isSettingDob: false });
                  }, 1000);
                }}
              />
              {this.state.isSettingDob ? (
                <View
                  style={{
                    left: 0,
                    right: 0,
                    position: 'absolute',
                    height: 50,
                    top: '30%',
                  }}
                >
                  {util.Lumper({ lumper: true, color: '#00355F', size: 15 })}
                </View>
              ) : (
                <View />
              )}
            </View>
            <View style={{ height:util.WP(15), width: '100%' }}>
              <View
                style={{ ...styles.labelInput, backgroundColor: '#F2F2F2' }}
              >
                <Text style={styles.labelTextInput}>Email</Text>
              </View>
              <TextInput
                style={{ ...styles.textInput, backgroundColor: '#F2F2F2' }}
                placeholder={'Email'}
                placeholderTextColor="#828282"
                keyboardType="email-address"
                value={this.props.user.email ? this.props.user.email : ''}
                editable={false}
              />
            </View>
            <View style={{ height:util.WP(13), width: '100%' }}>
              <View style={styles.labelInput}>
                <Text style={styles.labelTextInput}>Phone number</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder={'Phone Number'}
                placeholderTextColor="#828282"
                keyboardType="phone-pad"
                value={this.state.phone_number}
                onChangeText={this.handleChange}
                onBlur={() => this.onPhoneBlurCallBack()}
                returnKeyType={'done'}
              />
              {this.state.isEditingPhone ? (
                <View
                  style={{
                    left: 0,
                    right: 0,
                    position: 'absolute',
                    height: 50,
                    top: '30%',
                  }}
                >
                  {util.Lumper({ lumper: true, color: '#00355F', size: 15 })}
                </View>
              ) : (
                <View />
              )}
            </View>
            <View
              style={{
                height:util.WP(13),
                width: '100%',
                marginTop: 1,
                backgroundColor: '#fff',
              }}
            >
              <View style={styles.labelInput}>
                <Text style={styles.labelTextInput}>Gender</Text>
              </View>
              <SwitchSelector
                initial={
                  this.state.gender.length
                    ? this.state.gender == 'male'
                      ? 1
                      : 0
                    : -1
                }
                onPress={(value) => this.onGenderSelect(value)}
                borderColor="#fff"
                buttonColor="#F58220"
                textStyle={{ color: '#828282', fontFamily: 'Montserrat-Light' }}
                selectedTextContainerStyle={{
                  backgroundColor: '#F58220',
                  borderRadius: 50,
                }}
                style={{
                  width: '50%',
                }}
                selectedTextStyle={{
                  fontFamily: 'Montserrat-Bold',
                }}
                height={35}
                hasPadding
                options={[
                  { label: 'Female', value: 'female' }, //images.feminino = require('./path_to/assets/img/feminino.png')
                  { label: 'Male', value: 'male' }, //images.masculino = require('./path_to/assets/img/masculino.png')
                ]}
              />
              {this.state.isSettingGender ? (
                <View
                  style={{
                    left: 20,
                    right: 0,
                    position: 'absolute',
                    height: 50,
                    top: '30%',
                  }}
                >
                  {util.Lumper({ lumper: true, color: '#00355F', size: 15 })}
                </View>
              ) : (
                <View />
              )}
            </View>
          </View>
          <View
            style={{
              justifyContent: 'flex-end',
              flexDirection: 'column',
              marginTop: util.WP('5'),
            }}
          >
            <View
              style={{ height:util.WP(15), width: '100%', backgroundColor: '#fff' }}
            >
              <View style={styles.labelInput}>
                <Text style={styles.labelTextInput}>Country</Text>
              </View>
              <RNPickerSelect
                onValueChange={(value) => {
                  if (value && value != this.state.country) {
                    this.setState({ country: value });
                    if (Platform.OS === 'android') {
                      Alert.alert(
                        'Change Country',
                        'By changing your country, you will lose your client Card and any promotions and coupons within this Territory. You can change your country anytime and re-connect your client Card.',
                        [
                          {
                            text: 'No, not right now.',
                            onPress: () =>
                              this.setState({
                                country: this.props.user.user_info.country,
                              }),
                            style: 'cancel',
                          },
                          {
                            text: 'Yes, Change my Country.',
                            onPress: () => this.onCountrySelect(),
                          },
                        ],
                        { cancelable: false }
                      );
                    } else {
                    }
                  }
                }}
                onDonePress={(val) => {
                  if (this.state.country != this.props.user.user_info.country) {
                    this.setState({ changeCountryAlertModal: true });
                  }
                }}
                value={this.state.country}
                itemKey={this.state.country_items.toString()}
                style={{
                  inputIOS: styles.textInput,
                  inputAndroid: { ...styles.textInput, fontSize: 14 },
                  placeholder: { color: 'black', fontSize: 16 },
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
              {this.state.isSettingCountry ? (
                <View
                  style={{
                    left: 100,
                    right: 0,
                    position: 'absolute',
                    height: 50,
                    top: '30%',
                  }}
                >
                  {util.Lumper({ lumper: true, color: '#00355F', size: 15 })}
                </View>
              ) : (
                <View />
              )}
            </View>

            <View
              style={{
                height:util.WP(15),
                width: '100%',
                backgroundColor: '#fff',
                marginTop: 1,
              }}
            >
              <View style={styles.labelInput}>
                <Text style={styles.labelTextInput}>Area</Text>
              </View>

              <RNPickerSelect
                onValueChange={(value) => {
                  console.log('vallll', value)
                  if (value && value != this.state.location) {
                    this.setState({ location: value },() => {
                      if (Platform.OS === 'android') {
                        this.onLocationSelect();
                      }
                    })
                  }
                }}
                onDonePress={(val) => {
                  this.onLocationSelect();
                }}
                disabled={this.state.isFetchingLocations}
                //itemKey={this.props.country?this.props.country:""}
                value={this.state.location}
                style={{
                  inputIOS: styles.textInput,
                  inputAndroid: { ...styles.textInput, fontSize: 14 },
                  placeholder: { color: 'black', fontSize: 16 },
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
                items={this.props.locations ? this.props.locations:[{label:'Select...', value:''}]}
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

              {this.state.isFetchingLocations ||
              this.state.isSettingLocation ? (
                <View
                  style={{
                    position: 'absolute',
                    height: 50,
                    top: '30%',
                    right: 0,
                    left: 100,
                  }}
                >
                  {util.Lumper({ lumper: true, color: '#00355F', size: 15 })}
                </View>
              ) : (
                <View />
              )}
            </View>
          </View>
          <View style={{ marginTop: util.WP('6'), marginBottom: util.WP('6') }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('ChangePassword')}
            >
              <View style={styles.profileDataItem}>
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    style={styles.profilePageIcon}
                    source={require('../../../../assets/password.png')}
                  />
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: util.WP('5'),
                      color: '#00355F',
                      textAlign: 'left',
                    }}
                  >
                    Change Password
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}
mapStateToProps = (state) => {
  return {
    lumperShown: state.ui.isLoading,
    user: state.login.user,
    locations: state.login.countryLocations,
    defaultCountries: state.login.defaultCountries,
  };
};
mapDispatchToProps = (dispatch) => {
  return {
    updateUserProfileInfo: (payload) =>
      dispatch(TASKS.updateUserProfileInfo(payload)),
    getCountryLocations: (country) =>
      dispatch(TASKS.getCountryLocations(country)),
    getDefaultCountries: () => dispatch(TASKS.getDefaultCountries()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonalInformation);
