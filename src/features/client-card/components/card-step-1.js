import React, { Component } from 'react';
import {Image,FlatList, Button, Text,Alert, TextInput, View,ScrollView,TouchableOpacity,TouchableWithoutFeedback } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Card } from "react-native-elements";
import { styles } from '../../../styles';
import * as util from '../../../utilities';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Swiper from 'react-native-swiper';
import { connect } from 'react-redux';
import * as TASKS from '../../../store/actions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import analytics from '@react-native-firebase/analytics';

class CardStep1 extends Component {
  static navigationOptions = ({ navigation }) => ({
    //header: null,
    //headerMode: 'none',
    //gestures: null,
    //gesturesEnabled: false,
    headerTitle: (
         <Image style={styles.parentHeaderLogo} resizeMode="contain" source={require('../../../../assets/Logo.png')} />
     ),
     headerLeft: null
 });
    constructor(props) {
        super(props);
        this.state = {
          dob :null,
          firstName: this.props.user.first_name?this.props.user.first_name:"",
          isFirstNameError:false,
          firstNameError:'',
          lastName: this.props.user.last_name?this.props.user.last_name:"",
          isLastNameError:false,
          lastNameErrorText:'',
          email: this.props.user.email?this.props.user.email:"",
          phone: this.props.user.user_info.phone_number?this.normalizeInput(this.props.user.user_info.phone_number,false):"",
          isPhoneError:false,
          phoneErrorText:""
        }
        this.screenanalytics()
    }
    async screenanalytics() {
      await analytics().logScreenView({screen_name:'RegisterCardScreen'});
    }
    componentDidMount(){
      this.willFocusListner = this.props.navigation.addListener('willFocus', () => {
        this.props.apiResponse(false)
        this.props.apiResponseText('')
      })
    }
    componentWillUnmount() {
      this.willFocusListner.remove();
    }
    
    selectDob = () => {
      this.state.dob.onPressDate();
    }

    validateFields = () => {

      if (this.state.firstName == '' || this.state.lastName == '' || this.state.email == '' || this.state.phone == '') {
          util.showToast("Please don't leave any field blank.");
          return false;
      } else if (!util.emailValidator(this.state.email)) {
          util.showToast("Please enter a valid email address.");
          return false;
      }
      else if (this.state.phone != '' && this.state.phone.length != 14 ) {
        util.showToast("Phone Number is invalid.");
        return false;
      } 
      else {
          return true;
      }
  }
    // onIds(device) {
    //   //console.log('player id: ', device.userId);
    //   this.setState({player_id:device.userId})
    // }
    

    normalizeInput = (value, previousValue) => {
      if (!value) return value;
      const currentValue = value.replace(/[^\d]/g, '');
      if(value.length == 14) {
        let currentValueString=currentValue.toString();
        let phoneWithCountryCode=currentValueString;
        this.setState({ phone: phoneWithCountryCode});
        console.log('phoneWithCountryCode', phoneWithCountryCode);
      }
      if (!previousValue || value.length > previousValue.length) {
        if (currentValue.length <= 3) return currentValue;
        if (currentValue.length === 3) return `(${currentValue})`;
        if (currentValue.length <= 6) return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
        if (currentValue.length === 6) return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}-`
        return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
      }
    }

    handleChange = (value) => {
      const normalized = this.normalizeInput(value, this.state.phone);
      this.setState({ phone: normalized });
        if (value.length > 13) {
        this.setState({
          isPhoneError:false,
          phoneErrorText:''
        })
      }else{
        this.setState({
          isPhoneError:true,
          phoneErrorText:'Enter complete phone number'
        })
      }
    };

    validateFields(){
     console.log('first Name:',this.state.firstName.length)
          let _validFields = true;
          if (this.state.firstName.length < 3 ) {
            this.setState({isFirstNameError:true})
            this.setState({firstNameErrorText:'Minimum 3 characters requiredaa'})
            _validFields = false;
          }
          if (this.state.lastName.length < 3) {
            this.setState({isLastNameError:true})
            this.setState({lastNameErrorText:'Minimum 3 characters required'})
            _validFields = false;
          }
          if (this.state.phone.length < 14 ) {
            this.setState({
              isPhoneError:true,
              phoneErrorText:'Please Enter Phone number'
            })
            _validFields = false
          }

          if (_validFields) {
            
            this.setState({isLastNameError:false})
            this.setState({lastNameErrorText:''})
            this.setState({isFirstNameError:false})
            this.setState({firstNameErrorText:''})
          }
          return _validFields
        }

        submitAction =() =>{
          console.log('phone', this.state.phone)
      if (this.validateFields()) {
        Alert.alert(
            'Check Phone Numer',
            'Please check if your phone number '+this.state.phone+' is correct. You will receive a verification code on this phone number to complete your Digital client Card process!',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'OK, proceed', onPress: () => this.initiateclientCardRequest()},
            ],
            {cancelable: false},
          );
      }
    }
    initiateclientCardRequest = () => {
        util.isOnline(() => {
          var userData = {
            first_name:this.state.firstName,
            last_name:this.state.lastName,
            email:this.state.email,
            phone_number:this.state.phone,
          }
          this.props.registerCard(userData)
        }), () => {
          util.showToast('Network Error! You are not connected with Internet');
        }
    }
    onFirstNameChangeText = text => {
     if (text.length > 0) {
        if (text.length > 2) {
          this.setState({isFirstNameError:false})
          this.setState({firstNameErrorText:''})
        }else{
           this.setState({isFirstNameError:true})
           this.setState({firstNameErrorText:'Minimum 3 characters required'})
        }
     }else{
       this.setState({isFirstNameError:true})
       this.setState({firstNameErrorText:'First name is required'})
     }
     this.setState({firstName:text})
   }

   onLastNameChangeText = text => {
     if (text.length > 0) {
        if (text.length > 2) {
          this.setState({isLastNameError:false})
          this.setState({lastNameErrorText:''})
        }else{
           this.setState({isLastNameError:true})
           this.setState({lastNameErrorText:'Minimum 3 characters required'})
        }
     }else{
       this.setState({isLastNameError:true})
       this.setState({lastNameErrorText:'Last name is required'})
     }
     this.setState({lastName:text})
   }



  render() {
    return (
      <KeyboardAwareScrollView 
        style={styles.container}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="always"
        getTextInputRefs={() => {
            return [
              this._firstNameMLS,
              this._lastNameMLS,
              this._phoneNumberMLS,
            ];
          }}

      >
        <View style={styles.yellowContainerLarge}>
          {/* <View style={styles.logoContainer}>
            <Image style={styles.headerLogo} source={require('../../../../assets/Logo.png')} />
          </View> */}
          <View style={{ alignItems: 'flex-start', flexDirection: 'row',marginTop: 35,marginLeft:util.WP('5')}}>
            <TouchableOpacity style={{marginRight:17}} onPress={() => this.props.navigation.goBack()}>
              <Image style={{height:util.WP(7),width:util.WP(7)}} source={require('../../../../assets/arrow-left.png')} />
            </TouchableOpacity>
            <Text style={styles.h1TitleBreak}>
              Get started with your client Card
            </Text>
          </View>
        </View>
        <View style={{top:-util.WP('48'),width:'95%',left:10}}>
          <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column',marginTop: 15}}>
                  <View style={{height:util.WP(15),width:'100%'}}>
                      <View style={styles.labelInput}>
                        <Text style={styles.labelTextInput}>First Name</Text><Text style={{...styles.errorTextInput, alignSelf:'flex-start'}}>{this.state.isFirstNameError ? this.state.firstNameErrorText: ''}</Text>  
                      </View>
                      <TextInput
                      style={{...styles.textInput, borderColor: (this.state.isFirstNameError) ? 'red' : '#F2F2F2'}}
                      placeholder={""}
                      placeholderTextColor='#828282'
                      value={this.state.firstName}
                      // onBlur={() => this.onFirstNameBlurCallBack()}
                      onChangeText = {(text) => this.onFirstNameChangeText(text)}
                      // editable = {this.state.isEditingFirstName}
                      ref={(r) => { this._firstNameMLS = r; }}
                      returnKeyType={"next"}
                      onSubmitEditing={event => this._lastNameMLS.focus()}
                      />
                  </View>
                  <View style={{height:util.WP(15),width:'100%'}}>
                      <View style={styles.labelInput}>
                        <Text style={styles.labelTextInput}>Last Name</Text><Text style={{...styles.errorTextInput, alignSelf:'flex-start'}}>{this.state.isLastNameError ? this.state.lastNameErrorText: ''}</Text>  
                      </View>
                      <TextInput
                      style={{...styles.textInput, borderColor: (this.state.isLastNameError) ? 'red' : '#F2F2F2'}}
                      placeholder={""}
                      placeholderTextColor='#828282'
                      value={this.state.lastName}
                      // onBlur={() => this.onFirstNameBlurCallBack()}
                      onChangeText = {(text) => this.onLastNameChangeText(text)}
                      // editable = {this.state.isEditingFirstName}
                      ref={(r) => { this._lastNameMLS = r; }}
                      returnKeyType={"next"}
                      onSubmitEditing={event => this._phoneNumberMLS.focus()}
                      />
            </View>
                  

                  <View style={{height:util.WP(15),width:'100%'}}>
                      <View style={{...styles.labelInput, backgroundColor: '#F2F2F2'}}>
                        <Text style={styles.labelTextInput}>Email</Text><Text style={{...styles.errorTextInput, alignSelf:'flex-start'}}>{this.state.isEmailError ? this.state.emailErrorText: ''}</Text>  
                      </View>
                      <TextInput
                      style={{...styles.textInput,backgroundColor: '#F2F2F2'}}
                      placeholder={""}
                      placeholderTextColor='#828282'
                      editable={false}
                      autoCapitalize="none"
                      value={this.state.email}
                      onChangeText = {(text) => this.onEmailChangeText(text)}
                      />
                      </View>

                  {/* <TouchableOpacity
                  onPress = {}
                  >
                    <Text style={styles.textInput}>
                      {this.state.dob}
                    </Text>
                  </TouchableOpacity> 
                   <TouchableWithoutFeedback onPress={this.selectDob}>
                  <View style={{display:'flex',height: 60,width: util.WP('95'),borderColor: '#F2F2F2',borderBottomWidth: 1,backgroundColor:'#fff',paddingLeft:20,alignItems:'flex-start',justifyContent:'center'}}>
                  <Text style={ styles.placeHolderInputs }>{this.state.dob == null? 'Date of Birth':this.state.dob}</Text>
                  <DatePicker
                    style={styles.dateInput}
                    date={this.state.dob}
                    ref={(picker) => {
                        this.state.dob = picker;
                    }}
                    iconSource={null}
                    mode="date"
                    customStyles={{dateInput:{borderWidth: 1,justifyContent:'flex-start',width:util.WP('90')}}}
                    placeholder="Date of Birth"
                    format="YYYY-MM-DD"
                    confirmBtnText="Done"
                    cancelBtnText="Cancel"
                    maxDate={util.getMaxDateForDatePicker()}
                    onDateChange={(date) => {
                    this.setState({
                      dob: date
                    })
                  }} />
                  </View>
                  </TouchableWithoutFeedback>
                  */}
                  <View style={{height:util.WP(15),width:'100%',marginTop:2}}>
                    <View style={styles.labelInput}>
                      <Text style={styles.labelTextInput}>Phone number</Text> 
                      <Text style={{...styles.errorTextInput, alignSelf:'flex-start'}}>{this.state.isPhoneError ? this.state.phoneErrorText: ''}</Text> 
                    </View>
                    <TextInput
                    style={{...styles.textInput, fontSize:14,borderColor: (this.state.isPhoneError) ? 'red' : '#F2F2F2'}}
                    placeholder={"(868)555-5555"}
                    placeholderTextColor='black'
                    keyboardType = 'phone-pad'
                    ref={(r) => { this._phoneNumberMLS = r; }}
                      returnKeyType={"next"}
                    value = {this.state.phone}
                    // onChangeText = {(text)=>{this.setState({phone:text})}}
                    onChangeText = {this.handleChange}
                    />
                  </View>
            </View>
            <View style={{alignItems:'flex-start', marginLeft:12, marginBottom:5}}><Text style={{fontFamily:'Montserrat-SemiBold',color:this.props.apiResponseStatus ? 'green' : 'red'}}>{this.props.responseText}</Text></View>
            <View style={{ alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'column',marginTop: 20}}>
                  <TouchableOpacity
                   style={styles.containerButton}
                   // onPress={ () => this.props.navigation.navigate('CardVerification')}
                   onPress={this.submitAction}
                 >
                 {this.props.lumperShown ? util.Lumper({ lumper: true,color:'#fff' })
                 :<Text style={{fontSize: 16,fontFamily:'Montserrat-SemiBold',color:'#fff'}}>Register Card</Text>}

                 </TouchableOpacity>
            </View>
        </View>
        {/* <View style={styles.footerLogo}>
          <Image style={styles.headerLogo} source={require('../../../../assets/Logo.png')} />
          <Image style={styles.subHead} source={require('../../../../assets/subhead.png')} />
        </View> */}
      </KeyboardAwareScrollView>
    );
  }
}

mapStateToProps = state => {
  return {
      lumperShown: state.ui.isLoading,
      user:state.login.user,
      apiResponseStatus: state.ui.apiResponse,
      responseText: state.ui.responseText,
  }
}
mapDispatchToProps = dispatch => {
  return {
    registerCard: (userData) => dispatch(TASKS.registerCard(userData)),
    apiResponseText: (message) => dispatch(TASKS.apiResponseText(message)),
    apiResponse: (status) => dispatch(TASKS.apiResponse(status)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardStep1);
