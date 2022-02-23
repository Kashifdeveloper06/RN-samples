
import React, { Component } from 'react';
import {Image,FlatList, Button, Text, TextInput, View,ScrollView,TouchableOpacity,TouchableWithoutFeedback } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Card } from "react-native-elements";
import { styles } from '../../../styles';
import * as util from '../../../utilities';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import * as TASKS from '../../../store/actions';
import { Form, TextValidator } from 'react-native-validator-form';

class RegisterStep1 extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
         <Image style={styles.parentHeaderLogo} resizeMode="contain" source={require('../../../../assets/Logo.png')} />
     ),
     headerLeft: null
  });
  
  constructor(props) {
    super(props);
    
    this.state={
      uploading:false,
      image:(this.props.socialObj) ? this.props.socialObj.picture : null,
      firstName:this.props.user?this.props.user.first_name:"",
      isFirstNameError:false,
      firstNameErrorText:'',
      lastName:this.props.user && this.props.user.last_name != null ?this.props.user.last_name:"",
      isLastNameError:false,
      lastNameErrorText:'',
      email:this.props.user?this.props.user.email:"",
      isEmailError:false,
      emailErrorText:'',
      password:'',
      isFetching:false,
      hidePasswordLabel:false,
      isPasswordError:false,
      passwordErrorText:'',
      isNotFilled:true
    }
  }
  
  componentDidMount(){
    this.props.apiResponse(null)
    this.props.apiResponseCode(0)
    this.props.apiResponseText(null)
  }

  componentDidUpdate(prevProps){
      
    if (prevProps.apiCode !== this.props.apiCode && this.props.apiCode === 200) {
      this.gotToNextStep()
    }
    
    if (prevProps.apiCode !== this.props.apiCode && this.props.apiCode === 422) {
      this.setState({
        isEmailError:true,
        emailErrorText:this.props.responseText
      })
    }
  }
  
  capturePicture = () => {
    util.getPicture((image) => {
      var imageParam = {
        image:image.uri
      }
      this.props.uploadImage(imageParam)
      this.setState({ image: image.uri })
    }, () => { })
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
  onEmailChangeText = text => {
    if (text.length > 0) {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      if(reg.test(text) !== false){
            this.setState({isEmailError:false})
            this.setState({emailErrorText:''})
        } else {
            this.setState({isEmailError:true})
            this.setState({emailErrorText:'Please enter valid email address'})
        }
    }else{
      this.setState({isEmailError:true})
      this.setState({emailErrorText:'Email is required'})
    }

    this.setState({'email': text})

   }
   onPasswordChangeText = text => {
     if (text.length > 0) {
       if (!/[a-zA-Z]/.test(text)){
         this.setState({
          isPasswordError:true,
          passwordErrorText:'Enter at least one letter'
         })
       }else if(!/\d/.test(text)){
         this.setState({
          isPasswordError:true,
          passwordErrorText:'Enter at least one number'
         })

       }else if(text.length < 7 ){
           this.setState({
            isPasswordError:true,
            passwordErrorText:'Enter at least 7 characters'
           })  
       }else{
         this.setState({
           isPasswordError:false,
           passwordErrorText:''
         })  
       }
       // let reg = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{7,}$/
       // if (text .length > 6 && reg.test(text) !== false) {
       //     this.setState({hidePasswordLabel:false})
       //     this.setState({isPasswordError:false})
       //  this.setState({passwordErrorText:''})
       // }else if(){

       // }

       // else{
       //   this.setState({hidePasswordLabel:true})
       //   this.setState({isPasswordError:true})
       //  this.setState({passwordErrorText:'Minimum 7 characters containing at least one letter and one number'})
       // }
     }else{
       this.setState({hidePasswordLabel:false})
       this.setState({isPasswordError:true})
       this.setState({passwordErrorText:'Password is required'})
     }
     this.setState({password:text})
   }

   validateFields(){
     
          let _validFields = true;
          if (this.state.firstName.length < 3 ) {
            this.setState({isFirstNameError:true})
            this.setState({firstNameErrorText:'Minimum 3 characters required'})
            _validFields = false;
          }
          if (this.state.lastName.length < 3) {
            this.setState({isLastNameError:true})
            this.setState({lastNameErrorText:'Minimum 3 characters required'})
            _validFields = false;
          }
          if (!util.emailValidator(this.state.email)) {
            this.setState({isEmailError:true})
            this.setState({emailErrorText:'Please enter valid email address'})
            _validFields = false;
          }

          if (this.state.password.length > 0) {
           if (!/[a-zA-Z]/.test(this.state.password)){
             this.setState({
              isPasswordError:true,
              passwordErrorText:'Enter at least one letter'
             })
             _validFields = false;
           }else if(!/\d/.test(this.state.password)){
             this.setState({
              isPasswordError:true,
              passwordErrorText:'Enter at least one number'
             })
             _validFields = false;
           }else if(this.state.password.length < 7 ){
               this.setState({
                isPasswordError:true,
                passwordErrorText:'Enter at least 7 characters'
               })
             _validFields = false;  
           }else{
             this.setState({
               isPasswordError:false,
               passwordErrorText:''
             })  
           }
         }else{
           this.setState({hidePasswordLabel:false})
           this.setState({isPasswordError:true})
           this.setState({passwordErrorText:'Password is required'})
           _validFields = false;
         }

          if (_validFields) {
            this.setState({isPasswordError:false})
            this.setState({passwordErrorText:''})
            this.setState({isEmailError:false})
            this.setState({emailErrorText:''})
            this.setState({isLastNameError:false})
            this.setState({lastNameErrorText:''})
            this.setState({isFirstNameError:false})
            this.setState({firstNameErrorText:''})
          }
          return _validFields
        }
  handleSubmit = ()=>{
    if (this.validateFields()) {
      if (this.props.user && this.state.email != null && this.state.email == this.props.user.email) {
        this.gotToNextStep()
      }else{
        util.isOnline(() => {
          this.setState({isFetching:true})
          this.props.checkEmail(this.state.email)
          setTimeout(() => {
            this.setState({isFetching:false})
          }, 500)
        }), () => {
          util.showToast("No Network!");
        }
      }
    }
  }
  gotToNextStep(){
    var registerStepOneData = {
      profilePic:this.props.userImage,
      firstName:this.state.firstName,
      lastName:this.state.lastName,
      email:this.state.email,
      password:this.state.password,
    }
    this.props.navigation.navigate('RegisterStep2',{stepOneObject:registerStepOneData})
  }
  render() {
    return (
      <KeyboardAwareScrollView 
        style={styles.container}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="always"
        getTextInputRefs={() => {
            return [
              this._firstNameTI,
              this._lastNameTI,
              this._emailTI,
              this._passwordTI,
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
            {/* <Text style={styles.h1TitleBreak}>
              Please Enter your Personal Information
            </Text> */}
          </View>
          <View 
        style={{flexDirection: 'column',alignItems:'center',justifyContent:'center',marginTop:util.WP(5)}}
        >
           {this.props.lumperShown ? util.Lumper({ lumper: true })
           :
            <Image style={styles.profilePicture} source={{uri:this.state.image}} resizeMode='cover'/>
           }
           {this.props.lumperShown ? null
           :
           <TouchableOpacity
           onPress={this.capturePicture}
           style={{bottom:util.WP('8'),left:util.WP('10')}}
           >
             {/* <Image style={{right:util.WP('7'),top:util.WP('10')}} source={require('../../../../assets/edit-profile.png')} /> */}
             <Image style={{height:util.WP(7),width:util.WP(7)}} source={require('../../../../assets/edit-profile.png')} />
         </TouchableOpacity>
           }
          </View>
        </View>
        
        <View style={{top:-util.WP('20'),width:'95%',left:10}}>
            <View style={{ alignItems: 'stretch', justifyContent: 'center', flexDirection: 'column',marginTop: 15}}>
               {/* <TextValidator
                name="first_name"
                type="text"
                validators={['required','minStringLength:3']}
                errorMessages={['Please enter first name','Minimum length: 3']}
                style={{...styles.textInput, height:60}}
                placeholder={"First Name"}
                placeholderTextColor='#828282'
                value = {this.state.firstName}
                onChangeText = {(text)=>{this.setState({firstName:text})}}
                />*/}
                <View style={{height:util.WP(15),width:'100%'}}>
                      <View style={styles.labelInput}>
                        <Text style={styles.labelTextInput}>First Name</Text><Text style={{...styles.errorTextInput, alignSelf:'flex-start'}}>{this.state.isFirstNameError ? this.state.firstNameErrorText: ''}</Text>  
                      </View>
                      <TextInput
                      style={{...styles.textInput, borderColor: (this.state.isFirstNameError) ? 'red' : '#F2F2F2'}}
                      placeholder={""}
                      autoFocus={true}
                      placeholderTextColor='#828282'
                      value={this.state.firstName}
                      // onBlur={() => this.onFirstNameBlurCallBack()}
                      onChangeText = {(text) => this.onFirstNameChangeText(text)}
                      // editable = {this.state.isEditingFirstName}
                      ref={(r) => { this._firstNameTI = r; }}
                      returnKeyType={"next"}
                      onSubmitEditing={event => this._lastNameTI.focus()}
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
                      ref={(r) => { this._lastNameTI = r; }}
                      returnKeyType={"next"}
                      onSubmitEditing={event => this._emailTI.focus()}
                      />
            </View>
            <View style={{height:util.WP(15),width:'100%'}}>
                      <View style={styles.labelInput}>
                        <Text style={styles.labelTextInput}>Email</Text><Text style={{...styles.errorTextInput, alignSelf:'flex-start'}}>{this.state.isEmailError ? this.state.emailErrorText: ''}</Text>  
                      </View>
                      <TextInput
                      style={{...styles.textInput, borderColor: (this.state.isEmailError) ? 'red' : '#F2F2F2'}}
                      placeholder={""}
                      placeholderTextColor='#828282'
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={this.state.email}
                      // onBlur={() => this.onFirstNameBlurCallBack()}
                      onChangeText = {(text) => this.onEmailChangeText(text)}
                      // editable = {this.state.isEditingFirstName}
                      ref={(r) => { this._emailTI = r; }}
                      returnKeyType={"next"}
                      onSubmitEditing={event => this._passwordTI.focus()}
                      />
                      {this.state.isFetching ? 
                          <View style={{ position: 'absolute',height:50 ,top:"30%",right: 0, left: 0 }}>
                            {util.Lumper({ lumper: true,color:'#00355F', size: 15})}
                          </View>    
                        : 
                        <View></View>
                      }
            </View>

            <View style={{height:util.WP(15),width:'100%'}}>
                      <View style={styles.labelInput}>
                          <Text style={styles.labelTextInput}>Password</Text> 
                         <Text
                         style={{...styles.errorTextInput, alignSelf:'center',marginLeft:1}}
                           >
                           {this.state.isPasswordError ? this.state.passwordErrorText: ''}
                         </Text>  
                      </View>
                      <TextInput
                      style={{...styles.textInput, borderColor: (this.state.isPasswordError) ? 'red' : '#F2F2F2'}}
                      placeholder={""}
                      secureTextEntry={true}
                      placeholderTextColor='#828282'
                      value={this.state.password}
                      onChangeText = {(text) => this.onPasswordChangeText(text)}
                      // editable = {this.state.isEditingFirstName}
                      ref={(r) => { this._passwordTI = r; }}
                      returnKeyType={"next"}
                      />
            </View>
               {/* <TextValidator
                name="last_name"
                type="text"
                validators={['required']}
                errorMessages={['Please enter last name']}
                style={{...styles.textInput, height:60}}
                placeholder={"Last Name"}
                placeholderTextColor='#828282'
                value = {this.state.lastName}
                onChangeText = {(text)=>{this.setState({lastName:text})}}
                />*/}
               {/* <TextValidator
                style={{...styles.textInput, height:60}}
                name=  "email"
                type="text"
                validators={['required', 'isEmail']}
                errorMessages={['Please enter valid email address', 'Email invalid']}
                placeholder={"Email"}
                keyboardType = 'email-address'
                placeholderTextColor='#828282'
                value = {this.state.email}
                onChangeText = {(text)=>{this.setState({email:text})}}
                />*/}
               {/* <TextValidator
                validators={['required','minStringLength:6']}
                errorMessages={['Please enter password','Minimum Password Length: 6']}
                style={{...styles.textInput, height:60}}
                placeholder={"Password"}
                secureTextEntry={true}
                placeholderTextColor='#828282'
                value = {this.state.password}
                onChangeText = {(text)=>{this.setState({password:text})}}
                />*/}
            </View>
            <View style={{ alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'column',marginTop: 20}}>
                <TouchableOpacity
                style={styles.containerButton}
                onPress={ () => this.handleSubmit()}
                //disabled={this.state.isNotFilled}
                >
                <Text style={{fontSize: 16,fontFamily:'Montserrat-SemiBold',color:'#fff'}}>NEXT</Text>
                </TouchableOpacity>
            </View>
        </View>
        
      </KeyboardAwareScrollView>
    );
  }
}
mapStateToProps = state => {
  return {
      lumperShown: state.ui.isLoading,
      user:state.login.user,
      userImage:state.login.image,
      socialObj:state.login.socialObj,
      failedRegisteredEmail:state.login.failedRegisteredEmail,
      apiResponseStatus: state.ui.apiResponse,
      apiCode: state.ui.apiResponseCode,
      responseText: state.ui.responseText,
  }
}
mapDispatchToProps = dispatch => {
  return {
    uploadImage: (imageParam) => dispatch(TASKS.uploadImage(imageParam)),
    checkEmail:(email) => dispatch(TASKS.checkEmail(email)),
    apiResponseText: (message) => dispatch(TASKS.apiResponseText(message)),
    apiResponse: (status) => dispatch(TASKS.apiResponse(status)),
    apiResponseCode: (code) => dispatch(TASKS.apiResponse(code)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterStep1);

