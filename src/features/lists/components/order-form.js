import React, { Component } from 'react';
import {
  Image,
  FlatList,
  Button,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from '../../../styles';
import * as util from '../../../utilities';
import { connect } from 'react-redux';
import * as TASKS from '../../../store/actions';
import { Form, TextValidator } from 'react-native-validator-form';
import analytics from '@react-native-firebase/analytics';
import DeviceInfo from 'react-native-device-info';

class OrderForm extends Component {
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
      firstName: this.props.user.first_name ? this.props.user.first_name : '',
      isFirstNameError: false,
      firstNameErrorText: '',
      lastName: this.props.user.last_name ? this.props.user.last_name : '',
      isLastNameError: false,
      lastNameErrorText: '',
      email: this.props.user.email ? this.props.user.email : '',
      isEmailError: false,
      emailErrorText: '',
      phoneNo: this.props.user.user_info.phone_number
        ? this.normalizeInput(this.props.user.user_info.phone_number, false)
        : '',
      // phoneNo: '1234567890',
      isPhoneError: false,
      phoneErrorText: '',
      Address1: '',
      isAddress1Error: false,
      Address1ErrorText: '',
      Address2: '',
      isAddress2Error: false,
      Address2ErrorText: '',
      Area: '',
      isAreaError: false,
      AreaErrorText: '',
    };
    this.screenanalytics();
  }

  async screenanalytics() {
    await analytics().logScreenView({screen_name:'OrderFormScreen'});
  }

  componentDidMount() {
    console.log('stores', this.props.clientStores);
    console.log('OrderRequest', this.props.orderRequest);
  }

  onFirstNameChangeText = (text) => {
    if (text.length > 0) {
      if (text.length > 2) {
        this.setState({ isFirstNameError: false });
        this.setState({ firstNameErrorText: '' });
      } else {
        this.setState({ isFirstNameError: true });
        this.setState({ firstNameErrorText: 'Minimum 3 characters required' });
      }
    } else {
      this.setState({ isFirstNameError: true });
      this.setState({ firstNameErrorText: 'First name is required' });
    }
    this.setState({ firstName: text });
  };

  onLastNameChangeText = (text) => {
    if (text.length > 0) {
      if (text.length > 2) {
        this.setState({ isLastNameError: false });
        this.setState({ lastNameErrorText: '' });
      } else {
        this.setState({ isLastNameError: true });
        this.setState({ lastNameErrorText: 'Minimum 3 characters required' });
      }
    } else {
      this.setState({ isLastNameError: true });
      this.setState({ lastNameErrorText: 'Last name is required' });
    }
    this.setState({ lastName: text });
  };

  onEmailChangeText = (text) => {
    if (text.length > 0) {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(text) !== false) {
        this.setState({ isEmailError: false });
        this.setState({ emailErrorText: '' });
      } else {
        this.setState({ isEmailError: true });
        this.setState({ emailErrorText: 'Please enter valid Email Address' });
      }
    } else {
      this.setState({ isEmailError: true });
      this.setState({ emailErrorText: 'Email is required' });
    }
    this.setState({ email: text });
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

  onPNumberChangeText = (text) => {
    const normalized = this.normalizeInput(text, this.state.PhoneNo);
    this.setState({ phoneNo: normalized });
    if (text.length > 13) {
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

  onAddress1ChangeText = (text) => {
    if (text.length > 0) {
      if (text.length > 4) {
        this.setState({ isAddress1Error: false });
        this.setState({ Address1ErrorText: '' });
      } else {
        this.setState({ isAddress1Error: true });
        this.setState({ Address1ErrorText: 'Please enter valid address' });
      }
    } else {
      this.setState({ isAddress1Error: true });
      this.setState({ Address1ErrorText: 'Please enter valid address' });
    }
    this.setState({ Address1: text });
  };
  onAddress2ChangeText = (text) => {
    this.setState({ Address2: text });
  };
  onAreaChangeText = (text) => {
    if (text.length > 0) {
      if (text.length > 3) {
        this.setState({ isAreaError: false });
        this.setState({ AreaErrorText: '' });
      } else {
        this.setState({ isAreaError: true });
        this.setState({ AreaErrorText: 'Please enter valid area' });
      }
    } else {
      this.setState({ isAreaError: true });
      this.setState({ AreaErrorText: 'Please enter valid area' });
    }
    this.setState({ Area: text });
  };

  validateFields() {
    let _validFields = true;
    if (this.state.firstName.length < 3) {
      this.setState({ isFirstNameError: true });
      this.setState({ firstNameErrorText: 'Minimum 3 characters required' });
      _validFields = false;
    }
    if (this.state.lastName.length < 3) {
      this.setState({ isLastNameError: true });
      this.setState({ lastNameErrorText: 'Minimum 3 characters required' });
      _validFields = false;
    }
    if (!util.emailValidator(this.state.email)) {
      this.setState({ isEmailError: true });
      this.setState({ emailErrorText: 'Please enter valid Email address' });
      _validFields = false;
    }

    if (
      this.props.orderRequest.delivery_details.delivery_method == 'delivery'
    ) {
      if (this.state.Address1 < 4) {
        this.setState({ isAddress1Error: true });
        this.setState({ Address1ErrorText: 'Minimum 4 characters required' });
        _validFields = false;
      }
      if (this.state.Area < 3) {
        this.setState({ isAreaError: true });
        this.setState({ AreaErrorText: 'Minimum 3 characters required' });
        _validFields = false;
      }
    }
    if (this.state.phoneNo.length < 14) {
      this.setState({
        isPhoneError: true,
        phoneErrorText: 'Please Enter valid number',
      });
      _validFields = false;
    }
    if (_validFields) {
      this.setState({ isAddress2Error: false });
      this.setState({ Address2ErrorText: '' });
      this.setState({ isAreaError: false });
      this.setState({ AreaErrorText: '' });
      this.setState({ isAddress1Error: false });
      this.setState({ Address1ErrorText: '' });
      this.setState({ isPhoneError: false });
      this.setState({ phoneErrorText: '' });
      this.setState({ isEmailError: false });
      this.setState({ emailErrorText: '' });
      this.setState({ isLastNameError: false });
      this.setState({ lastNameErrorText: '' });
      this.setState({ isFirstNameError: false });
      this.setState({ firstNameErrorText: '' });
    }
    return _validFields;
  }

  handleSubmit = () => {
    if (this.validateFields()) {
      let _orderRequest = {
        card_number: this.props.orderRequest.card_number,
        total_price: this.props.orderRequest.total_price.toString(),
        delivery_details: {
          store_id: this.props.orderRequest.delivery_details.store_id,
          delivery_company_id: this.props.deliveryCompany,
          first_name: this.state.firstName,
          last_name: this.state.lastName,
          email: this.state.email,
          phone: this.state.phoneNo,
          address_line_1: this.state.Address1
            ? this.state.Address1
            : 'Address 1234',
          address_line_2: this.state.Address2,
          area: this.state.Area ? this.state.Area : '',
          delivery_method: this.props.orderRequest.delivery_details
            .delivery_method,
          license_plate_number: this.props.orderRequest.delivery_details
            .license_plate_number,
        },
        products: this.processOrderProducts(),
        coupons:this.processOrderBundles()
      };
      // console.log('orderRequest', _orderRequest);
      // this.props.navigation.navigate('ThankYou', {orderNumber: '9877987878978989798'})
      // this.props.addOrderProducts(_orderRequest);
      this.props.createOrder(_orderRequest);
      analytics().logEvent('Orders', {
        name:_orderRequest.delivery_details.first_name + _orderRequest.delivery_details.last_name,
        email:_orderRequest.delivery_details.email,
        area:_orderRequest.delivery_details.area,
        delivery_method:_orderRequest.delivery_details.delivery_method, 
        total_price: _orderRequest.total_price,
        country_code:this.props.user.user_info.country
      })
    } else {
      return;
    }
  };
  processOrderBundles(){
    let _bundles = []
    this.props.orderRequest.bundles.map((bundle) => {
      let _products = []
      if (bundle.type == 'mix_and_match') {
        _products = bundle.mix_n_match_products_added_to_list
      }
      let _bundle = {
        coupon_id: bundle.coupon_id,
        products:_products
      }
      _bundles.push(_bundle)
    })
    return _bundles
  }
  processOrderProducts() {
    let _products = [];
    this.props.orderRequest.products.map((product, index) => {
      let _product = {
        id: product.id,
        quantity: product.quantity,
      };
      _products.push(_product);
    });
    return _products;
  }

  render() {
    console.log('deliveryCompany', this.props.deliveryCompany);
    return (
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="always"
        getTextInputRefs={() => {
          return [
            this._firstNameTI,
            this._lastNameTI,
            this._emailTI,
            this._PNumber,
            this._Address1,
            this._Address2TI,
            this._AreaTI,
          ];
        }}
      >
        <View style={styles.blueContainerSmall}>
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
            <Text style={styles.h1ListTitle}>Complete Order</Text>
          </View>
        </View>
        <View style={{ marginTop: util.HP(4) }}>
          <View style={{ marginHorizontal: 20 }}>
            <Text
              style={{
                color: '#004678',
                fontFamily: 'Montserrat-Bold',
                fontSize: 15,
              }}
            >
              {this.props.orderRequest.delivery_details.delivery_method ==
              'delivery'
                ? 'Delivery Order for :'
                : 'Order for :'}
            </Text>
            <View
              style={{
                alignItems: 'stretch',
                justifyContent: 'center',
                flexDirection: 'column',
                marginTop: 15,
              }}
            >
              <View style={{ height: DeviceInfo.isTablet() ? 63 :  60, width: '100%' }}>
                <View style={styles.labelInput}>
                  <Text style={styles.labelTextInput}>First Name</Text>
                  {this.state.isFirstNameError && (
                    <Text
                      style={{
                        ...styles.errorTextInput,
                        alignSelf: 'flex-start',
                      }}
                    >
                      {this.state.firstNameErrorText}
                    </Text>
                  )}
                </View>
                <TextInput
                  style={{
                    ...styles.textInput,
                    borderColor: '#fff',
                  }}
                  placeholder={'First name'}
                  placeholderTextColor="#828282"
                  value={this.state.firstName}
                  // onBlur={() => this.onFirstNameBlurCallBack()}
                  onChangeText={(text) => this.onFirstNameChangeText(text)}
                  // editable = {this.state.isEditingFirstName}
                  ref={(r) => {
                    this._firstNameTI = r;
                  }}
                  returnKeyType={'next'}
                  onSubmitEditing={(event) => this._lastNameTI.focus()}
                />
              </View>
              <View style={{ marginTop:1,height: DeviceInfo.isTablet() ? 63 :  60, width: '100%' }}>
                <View style={styles.labelInput}>
                  <Text style={styles.labelTextInput}>Last Name</Text>
                  {this.state.isLastNameError && (
                    <Text
                      style={{
                        ...styles.errorTextInput,
                        alignSelf: 'flex-start',
                      }}
                    >
                      {this.state.lastNameErrorText}
                    </Text>
                  )}
                </View>
                <TextInput
                  style={{
                    ...styles.textInput,
                    borderColor: '#fff',
                  }}
                  placeholder={'Last name'}
                  placeholderTextColor="#828282"
                  value={this.state.lastName}
                  // onBlur={() => this.onFirstNameBlurCallBack()}
                  onChangeText={(text) => this.onLastNameChangeText(text)}
                  // editable = {this.state.isEditingFirstName}
                  ref={(r) => {
                    this._lastNameTI = r;
                  }}
                  returnKeyType={'next'}
                  onSubmitEditing={(event) => this._emailTI.focus()}
                />
              </View>
              <View style={{ marginTop:1,height: DeviceInfo.isTablet() ? 63 :  60, width: '100%' }}>
              
                <View style={styles.labelInput}>
                  <Text style={styles.labelTextInput}>Email Address</Text>
                  {this.state.isEmailError && (
                    <Text
                      style={{
                        ...styles.errorTextInput,
                        alignSelf: 'flex-start',
                      }}
                    >
                      {this.state.emailErrorText}
                    </Text>
                  )}
                </View>
                <TextInput
                  style={{
                    ...styles.textInput,
                    borderColor: '#fff',
                  }}
                  placeholder={'Email'}
                  placeholderTextColor="#828282"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={this.state.email}
                  // onBlur={() => this.onFirstNameBlurCallBack()}
                  onChangeText={(text) => this.onEmailChangeText(text)}
                  // editable = {this.state.isEditingFirstName}
                  ref={(r) => {
                    this._emailTI = r;
                  }}
                  returnKeyType={'next'}
                  onSubmitEditing={(event) => this._PNumber.focus()}
                />
              </View>
              <View style={{ marginTop:1,height: DeviceInfo.isTablet() ? 63 :  60, width: '100%' }}>
                <View style={styles.labelInput}>
                  <Text style={styles.labelTextInput}>Phone Number</Text>
                  {this.state.isPhoneError && (
                    <Text
                      style={{
                        ...styles.errorTextInput,
                        alignSelf: 'flex-start',
                      }}
                    >
                      {this.state.phoneErrorText}
                    </Text>
                  )}
                </View>
                <TextInput
                  style={{
                    ...styles.textInput,
                    fontSize: util.WP(3.5),
                    borderColor: '#fff',
                  }}
                  placeholder={'(868)555-5555'}
                  placeholderTextColor="#828282"
                  keyboardType="phone-pad"
                  returnKeyType={'next'}
                  value={this.state.phoneNo}
                  // onChangeText = {(text)=>{this.setState({phone:text})}}
                  onChangeText={(text) => this.onPNumberChangeText(text)}
                  returnKeyType={'done'}
                  ref={(r) => {
                    this._PNumber = r;
                  }}
                  //onSubmitEditing={event => this._Address1.focus()}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={{ marginTop: util.HP(4) }}>
          <View style={{ marginHorizontal: 20 }}>
            {this.props.orderRequest.delivery_details.delivery_method ==
            'delivery' ? (
              <View>

              <Text
                style={{
                  color: '#004678',
                  fontFamily: 'Montserrat-Bold',
                  fontSize: 15,
                }}
              >
                Address
              </Text>
              
              <View
                style={{
                  alignItems: 'stretch',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  marginTop: 15,
                }}
              >
                <View style={{ height: DeviceInfo.isTablet() ? 63 :  60, width: '100%' }}>
                  <View style={styles.labelInput}>
                    <Text style={styles.labelTextInput}>Address 1</Text>
                    {this.state.isAddress1Error && (
                      <Text
                        style={{
                          ...styles.errorTextInput,
                          alignSelf: 'flex-start',
                        }}
                      >
                        {this.state.Address1ErrorText}
                      </Text>
                    )}
                  </View>
                  <TextInput
                    style={{
                      ...styles.textInput,
                      borderColor: '#fff',
                    }}
                    placeholder={'Address 1'}
                    placeholderTextColor="#828282"
                    value={this.state.Address1}
                    // onBlur={() => this.onFirstNameBlurCallBack()}
                    onChangeText={text => this.onAddress1ChangeText(text)}
                    // editable = {this.state.isEditingFirstName}
                    ref={r => {
                      this._Address1 = r;
                    }}
                    returnKeyType={'next'}
                    onSubmitEditing={event => this._Address2TI.focus()}
                  />
                </View>
                <View style={{ height: DeviceInfo.isTablet() ? 63 :  60, width: '100%' }}>
                  <View style={styles.labelInput}>
                    <Text style={styles.labelTextInput}>Address 2</Text>
                    {this.state.isAddress2Error && (
                      <Text
                        style={{
                          ...styles.errorTextInput,
                          alignSelf: 'flex-start',
                        }}
                      >
                        {this.state.Address2ErrorText}
                      </Text>
                    )}
                  </View>
                  <TextInput
                    style={{
                      ...styles.textInput,
                      borderColor: '#fff',
                    }}
                    placeholder={'Address 2'}
                    placeholderTextColor="#828282"
                    value={this.state.Address2}
                    // onBlur={() => this.onFirstNameBlurCallBack()}
                    onChangeText={text => this.onAddress2ChangeText(text)}
                    // editable = {this.state.isEditingFirstName}
                    ref={r => {
                      this._Address2TI = r;
                    }}
                    returnKeyType={'next'}
                    onSubmitEditing={event => this._AreaTI.focus()}
                  />
                </View>
                <View style={{ height: DeviceInfo.isTablet() ? 63 :  60, width: '100%' }}>
                  <View style={styles.labelInput}>
                    <Text style={styles.labelTextInput}>Area</Text>
                    {this.state.isAreaError && (
                      <Text
                        style={{
                          ...styles.errorTextInput,
                          alignSelf: 'flex-start',
                        }}
                      >
                        {this.state.AreaErrorText}
                      </Text>
                    )}

                  </View>
                  <TextInput
                    style={{
                      ...styles.textInput,
                      borderColor: '#fff',
                    }}
                    placeholder={'Area'}
                    placeholderTextColor="#828282"
                    value={this.state.Area}
                    // onBlur={() => this.onFirstNameBlurCallBack()}
                    onChangeText={text => this.setState({Area:text})}
                    // editable = {this.state.isEditingFirstName}
                    ref={r => {
                      this._AreaTI = r;
                    }}
                    returnKeyType={'done'}
                  />
                </View>
              </View>
              </View>
            ) : null}

            <View
              style={{
                alignItems: 'flex-start',
                justifyContent: 'center',
                flexDirection: 'column',
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                style={[styles.containerButton, { backgroundColor: '#f58121' }]}
                onPress={this.handleSubmit}
                //disabled={this.state.isNotFilled}
              >
                {this.props.lumperShown ? (
                  util.Lumper({ lumper: true, color: '#fff' })
                ) : (
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Montserrat-SemiBold',
                      color: '#fff',
                    }}
                  >
                    Complete Order
                  </Text>
                )}
              </TouchableOpacity>
            </View>
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
    orderRequest: state.Lists.orderRequest,
    clientStores: state.login.stores,
    deliveryCompany: state.Lists.deliveryCompany,
  };
};
mapDispatchToProps = (dispatch) => {
  return {
    createOrder: (_orderRequest) => dispatch(TASKS.createOrder(_orderRequest)),
    addOrderProducts: (orderProducts) => dispatch(TASKS.addOrderProducts(orderProducts)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderForm);
