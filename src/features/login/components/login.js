
import React, { Component } from 'react';
import {StatusBar,FlatList, Button, Text,Platform, TextInput,Dimensions, View,ScrollView,TouchableOpacity, SafeAreaView,Image } from 'react-native';
import { Card,SocialIcon } from "react-native-elements";
import * as util from '../../../utilities';
import { styles } from '../../../styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Swiper from 'react-native-swiper';
import { connect } from 'react-redux';
import Modal from "react-native-modal";
import RNLocation from 'react-native-location';
import * as TASKS from '../../../store/actions';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';

import OneSignal from 'react-native-onesignal';
// import { LoginManager,LoginButton,AccessToken,GraphRequest,GraphRequestManager} from 'react-native-fbsdk-next';
import clientLogoSVG from './clientLogoSVG';
import Moment from 'moment';
import { Form, TextValidator } from 'react-native-validator-form';
import appleAuth, {
  AppleButton,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';

const STATUS_BAR_HEIGHT = util.isIphoneX() ? 44 : StatusBar.currentHeight;
function StatusBarPlaceHolder() {
  return (
    <View 
      style={{width: "100%",height: STATUS_BAR_HEIGHT,backgroundColor: "#FCD504"}}
    >
      <StatusBar barStyle="dark-content" />
    </View>
  );
}

class Login extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <Image style={styles.parentHeaderLogo} resizeMode="contain" source={require('../../../../assets/Logo.png')} />
    ),
    headerLeft: null,
  });
    
  constructor(props) {
    super(props)
        
    this.state = {
      email: "",
      isEmailError:false,
      emailErrorText:'',
      password:"",
      isPasswordError:false,
      passwordErrorText:'',
      validFields:true,
      forgotEmail: "",
      forgorEmailError:"",
      modalIsVisible:false,
      player_id:""
    }
    //OneSignal Event listner to get user's player ID
    OneSignal.addEventListener('ids', this.onIds)
  }

  componentDidMount(){
    console.log('defaultCountries', this.props.defaultCountries)
    this.props.storeUser(null)
    this.props.saveSocialObj(null)
   
    this.willFocusListner = this.props.navigation.addListener('willFocus', () => {
      if (this.props.failedRegisteredEmail) {
        this.state.email = this.props.failedRegisteredEmail
        this._passwordLogin.focus()
      }
      this.props.apiResponseText('')
      this.props.apiResponse(false)
      this.props.storeFailedRegisteredEmail(null)
    })
    this.configureGoogleClient()
  }
  
  
  componentWillUnmount(){
    //Remove listners
    OneSignal.removeEventListener('ids', this.onIds);
    this.willFocusListner.remove()
  }

  onIds = (device) =>  { // callback function to get player Id and then set State
    console.log('playerID', device.userId)
    this.setState({player_id:device.userId})
  }
  
  configureGoogleClient= (success, reject) =>{
    GoogleSignin.configure();
  }
  onAppleButtonPress = async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
    });
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

    // use credentialState response to ensure the user is authenticated
    if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
      // user is authenticated
      if (appleAuthRequestResponse.email != null) {
        console.log('response', appleAuthRequestResponse)
        const {player_id} = this.state;
        let credentials = {
          first_name:appleAuthRequestResponse.fullName.givenName,
          last_name:appleAuthRequestResponse.fullName.familyName,
          email:appleAuthRequestResponse.email,
          provider:'apple',
          provider_id:appleAuthRequestResponse.user,
          player_id:player_id
        }
        this.props.loginSocial(credentials)
      }else{
        let payload = {
          provider_id:appleAuthRequestResponse.user
        }
        this.props.signinWithApple(payload)
      }
    }
  }
  signInGoogle = async () => {
    const {loginSocial,saveSocialObj} = this.props;
    const {player_id} = this.state;
    const userInfo = await GoogleSignin.signIn()
            .then(function (result) {
              console.log(result)
              if (result.user.email) {
                let socialObject = {
                  picture: result.user.photo ? result.user.photo : '',
                }
                saveSocialObj(socialObject)
                var credentials = {
                  first_name:result.user.givenName != null ? result.user.givenName:'',
                  last_name:result.user.familyName && result.user.familyName != null ?result.user.familyName:'' ,
                  email:result.user.email,
                  provider:'google',
                  provider_id:result.user.id,
                  player_id:player_id
                }
                loginSocial(credentials)
              }else{
                util.showToast("Could not connect to Google");
              }
            },function (error) {
              console.log('Login fail with error: ' + error)
          });
        
  }
  
  handleFacebookLogin() {
    const {player_id} = this.state;
    util.isOnline(() => {
      util.getFacebookDetails((facebookDetails) => {
        if (facebookDetails.email) {
            let socialObject = {
              picture: facebookDetails.picture.data.url ? facebookDetails.picture.data.url : '',
              city: facebookDetails.location ? facebookDetails.location.location.city : '',
              birthday: facebookDetails.birthday ? Moment(facebookDetails.birthday).format('YYYY-MM-DD'): '',
            }
          this.props.saveSocialObj(socialObject)
          var credentials = {
            first_name:facebookDetails.first_name,
            last_name:facebookDetails.last_name,
            email:facebookDetails.email,
            provider:'facebook',
            provider_id:facebookDetails.id,
            player_id:player_id
          }
          this.props.loginSocial(credentials)            
        }else{
          util.showToast("Could not connect to Facebook");    
        }
      }, () => { })
    
    }, () => {
      util.showToast(util.INTERNET_CONNECTION_ERROR);
    })
  }
  
  validateFields(){
    
    let _validFields = true;
    if (!util.emailValidator(this.state.email)) {
      this.setState({isEmailError:true})
      this.setState({emailErrorText:'Please enter valid email address'})
      _validFields = false;
    }
    if (!this.state.password.length) {
      this.setState({isPasswordError:true})
      this.setState({passwordErrorText:'Please Enter Password'})
      _validFields = false;
    }
    if (_validFields) {
      this.setState({isEmailError:false})
      this.setState({emailErrorText:''})
      this.setState({isPasswordError:false})
      this.setState({passwordErrorText:''})
    }
    
    return _validFields
  }
  
  handleLoginSubmit =() =>{
    if(this.validateFields()){
      util.isOnline(() => {
        var credentials = {
          email:this.state.email,
          password:this.state.password,
          player_id:this.state.player_id
        }
        this.props.login(credentials)
      }, () => {
        util.showToast(util.INTERNET_CONNECTION_ERROR);
      })
    }
  }
  

  modalForgotPasswordToggler = () => {
    this.props.apiResponse(false)
    this.props.apiResponseText('')
    this.setState({ modalIsVisible: !this.state.modalIsVisible });
    setTimeout(() => {
      if(util.emailValidator(this.state.email)){
        this._passwordLogin.focus()
      }else{
        this.setState({email:''})
      }
    },300)
  }

  async onForgotPasswordEmailSubmit(){
    
    this.setState({forgorEmailError:''})
    this.props.apiResponse(false)
    this.props.apiResponseText('')
    
    util.isOnline(() => {
        if (this.state.email == '') {
          this.setState({forgorEmailError:'Please Enter Email'})
        }else if(!util.emailValidator(this.state.email)){
          this.setState({forgorEmailError:'Please enter valid email address'})
        }else{
           this.props.forgotPassword(this.state.email)
        }

      }), () => {
        util.showToast(util.INTERNET_CONNECTION_ERROR);
      }
  }

  modalForgotPassword(){
    return(
      <Modal 
        style={{margin:0}} 
        isVisible={this.state.modalIsVisible}
        animationIn="slideInUp"
        animationInTiming={200}
        backdropOpacity={0.90}
        deviceWidth={Dimensions.get('window').width}
        deviceHeight={Dimensions.get('window').height}
      >
        <View style={{bottom:util.WP('30')}}>
          <View style={styles.modalClose}>
            <TouchableOpacity onPress={()=>{this.modalForgotPasswordToggler()}}>
              <Image style={{height:util.WP(10),width:util.WP(10)}} source={require('../../../../assets/close-round.png')} />
            </TouchableOpacity>
          </View>
          <View style={styles.smallModalContainer}>
            <Text style={styles.modalTitle}>
              Forgot Password
            </Text>
            
            <TextInput 
              style={{height:util.WP(10),borderWidth:1,borderColor:'#F2F2F2'}} 
              placeholder={"Enter email"}
              keyboardType = 'email-address'
              placeholderTextColor='#828282'
              value = {this.state.email}
              onChangeText = {(text)=>{this.setState({email:text})}}
            />
            
            <Text style={{color:'red'}}>
              {this.state.forgorEmailError}
            </Text>
            
            <Text style={{color:this.props.apiResponseStatus ? 'green' : 'red'}}>
              {this.props.responseText}
            </Text>
            {this.props.lumperShown ?
            <View style={styles.containerButton}>
            {util.Lumper({ lumper: true,color:"#fff" })}
              </View>
            :
              <TouchableOpacity 
                style={styles.modalBlueButton}
                onPress ={() => this.props.apiResponseStatus ? this.modalForgotPasswordToggler():this.onForgotPasswordEmailSubmit()}
              >
                <Text style={{fontSize: util.WP('4'),fontFamily:'Montserrat-SemiBold',color:'#fff'}}>{this.props.apiResponseStatus ? 'OK': 'Send Password'}</Text>
              </TouchableOpacity>
            }
          </View>
        </View>
      </Modal>
    );
  }

  onEmailChangeText = text => {
    
    if (text.length > 0) {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
      if(reg.test(text) !== false){
            this.setState({isEmailError:false})
            this.setState({emailErrorText:''})
        } else {
            this.setState({isEmailError:true})
            this.setState({emailErrorText:'Please enter valid email address'})
        }
    }else{
      this.setState({isEmailError:true})
      this.setState({emailErrorText:'Please Enter Email'})
    }

    this.setState({'email': text})
  }

  onPasswordChangeText = text => {
    if (text) {
      this.setState({isPasswordError:false})
      this.setState({passwordErrorText:''})
    }else{
      this.setState({isPasswordError:true})
      this.setState({passwordErrorText:'Please enter password'})
    }
    this.setState({password:text})
 }
 registerGuest(){
   this.props.resgisterAsGuest(true)
   setTimeout(() => {
     this.props.navigation.navigate('Home')
   },1000)
 }
 
 render() {

    return (     
      <ScrollView style={styles.container}>
        {this.modalForgotPassword()}
        
        <View style={styles.yellowContainerLargeLogin}>
          <View style={{ alignItems: 'center',justifyContent:'center', flexDirection: 'row',marginTop: 15,marginLeft:util.WP('5'),height:60}}>
            <Text style={styles.h1TitleBreak}>
              Login To client Stores
            </Text>
            
            <TouchableOpacity 
              onPress={ () => this.registerGuest()}
              style={{marginLeft:20}}
            >
              <Text style={{color:'#FB7300', fontFamily:'Montserrat-SemiBold', fontSize:util.HP(1.5)}}>SKIP</Text>
            </TouchableOpacity>
            
          </View>
          <View style={{ alignItems: 'stretch', justifyContent: 'center', flexDirection: 'column',marginTop: 15,width:'95%',left:9}}>
            <View style={{height:util.WP(15),width:'100%'}}>
              <View style={{...styles.labelInput}}>
                <Text style={styles.labelTextInput}>Email</Text><Text style={{...styles.errorTextInput, alignSelf:'flex-start'}}>{this.state.isEmailError ? this.state.emailErrorText: ''}</Text>  
              </View>
              <TextInput
                style={{...styles.textInput, borderColor: (this.state.isEmailError) ? 'red' : '#F2F2F2'}}
                placeholder={""}
                placeholderTextColor='#828282'
                value={this.state.email}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText = {(text) => this.onEmailChangeText(text)}
                ref={(r) => { this._emailLogin = r; }}
                returnKeyType={"next"}
                onSubmitEditing={event => this._passwordLogin.focus()}
              />
            </View>
            <View style={{height:util.WP(15),width:'100%'}}>
              <View style={styles.labelInput}>
                <Text style={styles.labelTextInput}>Password</Text><Text style={{...styles.errorTextInput, alignSelf:'flex-start'}}>{this.state.isPasswordError ? this.state.passwordErrorText: ''}</Text>  
              </View>
              <TextInput
                style={{...styles.textInput, borderColor: (this.state.isPasswordError) ? 'red' : '#F2F2F2'}}
                placeholder={""}
                secureTextEntry={true}
                placeholderTextColor='#828282'
                value={this.state.password}
                onChangeText = {(text) => this.onPasswordChangeText(text)}
                ref={(r) => { this._passwordLogin = r; }}
                returnKeyType={"next"}
              />
            </View>
          </View>
        </View>

        <View style={{width:'95%',left:10}}>
          <View style={{alignItems:'flex-start', marginLeft:12, marginBottom:5}}><Text style={{fontFamily:'Montserrat-SemiBold',color:this.props.apiResponseStatus ? 'green' : 'red'}}>{this.props.responseText}</Text></View>
          <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row',marginTop: 20}}>
          {this.props.lumperShown ?
            <View style={styles.containerButton} >
              {util.Lumper({ lumper: true,color:"#fff" })}
            </View>
          :
            <TouchableOpacity
              style={styles.containerButton}
              onPress={ () => this.handleLoginSubmit()}
            >
              <Text style={{fontSize: 16,fontFamily:'Montserrat-SemiBold',color:'#fff'}}>LOGIN</Text>
            </TouchableOpacity>
              
          }
          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row',marginTop: 20}}>
            <TouchableOpacity onPress = {() => this.modalForgotPasswordToggler()}>
              <Text>Forgot Password ?</Text>
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row',marginTop: 20}}>
            <TouchableOpacity
              style={styles.containerButton}
              onPress={ () => this.props.navigation.navigate('RegisterStep1')}
            >
               <Text style={{fontSize: 16,fontFamily:'Montserrat-SemiBold',color:'#fff'}}>SIGN UP</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{width:'100%'}}>
          <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column',marginTop: 10}}>
            
            <View style={{marginBottom:5}}>
              <Text style={styles.h1Title}>
                Use Social Media Accounts
              </Text>
            </View>
            
            
            <SocialIcon
              title='Sign In With Facebook'
              button
              light
              type='facebook' 
              style={{width:'74%', borderRadius:2}}
              onPress={ () => this.handleFacebookLogin()}
            />

            {/*<LoginButton
          onLoginFinished={
            (error, result) => {
              if (error) {
                console.log("login has error: " + error);
              } else if (result.isCancelled) {
                console.log("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    console.log(data.accessToken.toString())
                  }
                )
              }
            }
          }
          onLogoutFinished={() => console.log("logout.")}/>*/}

            
            <SocialIcon
              title='Sign In With Google'
              button
              light
              type='google' 
              style={{width:'74%', borderRadius:2}}
              onPress={this.signInGoogle}
            />

            <View>
            {Platform.OS === 'ios' && <AppleButton
              buttonStyle={AppleButton.Style.WHITE}
              buttonType={AppleButton.Type.SIGN_IN}
              cornerRadius={2}
              style={{
                width: util.WP(74),
                height: 50,
                marginTop:3,
                shadowColor: '#9D9D9D',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.8,
                shadowRadius: 1, 
              }}
              onPress={() => this.onAppleButtonPress()}
            />}
          </View>
          </View>
        </View>

      </ScrollView>
    );
  }
}

mapStateToProps = state => {
  return {
    lumperShown: state.ui.isLoading,
    apiResponseStatus: state.ui.apiResponse,
    responseText: state.ui.responseText,
    user:state.login.user,
    isGuestUser:state.login.isGuestUser,
    defaultCountries:state.login.defaultCountries,
    country:state.login.country,
    socialObj:state.login.socialObj,
    apiResponseStatus: state.ui.apiResponse,
    responseText: state.ui.responseText,
    failedRegisteredEmail:state.login.failedRegisteredEmail,
  }
}

mapDispatchToProps = dispatch => {
  return {
    login: (credentials) => dispatch(TASKS.loginUser(credentials)),
    loginSocial: (socialCredentials) => dispatch(TASKS.loginUserSocial(socialCredentials)),
    signinWithApple:(_payload) => dispatch(TASKS.signinWithApple(_payload)),
    getPromotions: (country) => dispatch(TASKS.fetchPromotions(country)),
    storeUser: (user) => dispatch(TASKS.storeUser(user)),
    storeCountry: (country) => dispatch(TASKS.storeCountry(country)),
    resgisterAsGuest: (status) => dispatch(TASKS.resgisterAsGuest(status)),
    saveSocialObj: (fbObj) => dispatch(TASKS.saveSocialObj(fbObj)),
    forgotPassword: (email) => dispatch (TASKS.forgotPassword(email)),
    apiResponseText: (message) => dispatch(TASKS.apiResponseText(message)),
    apiResponse: (status) => dispatch(TASKS.apiResponse(status)),
    storeFailedRegisteredEmail: (email) => dispatch(TASKS.storeFailedRegisteredEmail(email)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

