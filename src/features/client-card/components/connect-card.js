import React, { Component } from 'react';
import {Image,FlatList, Button, Text, TextInput, View,ScrollView,TouchableOpacity,Alert } from 'react-native';
import { Card } from "react-native-elements";
import * as util from '../../../utilities';
import { styles } from '../../../styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Swiper from 'react-native-swiper';
import { connect } from 'react-redux';
import Modal from "react-native-modal";
import * as TASKS from '../../../store/actions';
import analytics from '@react-native-firebase/analytics';

class ConnectCard extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
         <Image style={styles.parentHeaderLogo} resizeMode="contain" source={require('../../../../assets/Logo.png')} />
     ),
     headerLeft: null
 });
    constructor(props) {
        super(props);

        const { navigation } = this.props;
        this.state = {
          cardNumber: JSON.stringify(navigation.getParam('barcode'))? JSON.stringify(navigation.getParam('barcode')):'',
          modalMismatchCardInfo:false,
          sendingVerification:false,
          isMounted:false
        }
        this.screenanalytics();
    }

    async screenanalytics() {
      await analytics().logScreenView({screen_name:'ConnectCardScreen'});
    }
    componentDidMount(){
      this.willFocusListner = this.props.navigation.addListener('willFocus', () => {
        this.props.apiResponse(false)
        this.props.apiResponseText('')
      })
      this.setState({isMounted:true})
    }
    componentWillUnmount() {
      this.willFocusListner.remove();
    }

    componentDidUpdate(prevProps){
      
      if (prevProps.apiResponseCode !== this.props.apiResponseCode && this.props.apiResponseCode === 999) {
        this.setState({modalMismatchCardInfo:true})
      }
    }


    validateFields = () => {

      if (this.state.cardNumber == '') {
          util.showToast("Please enter card Number.");
          return false;
      }
      else {
          return true;
      }
  }

  refresh = (barcode) => {
    if (barcode) {
      this.setState({cardNumber:barcode})
    }
  }

  connectCard = () =>{
    console.log('ok')
    this.props.apiResponse(false)
    this.props.apiResponseText('')
    this.props.setApiResponseCode(false)
    if (this.validateFields()) {
      this.props.connectCard(this.state.cardNumber);
    }
    
  }
  modalMismatchConnectCardToggler(){
    this.setState({modalMismatchCardInfo: !this.state.modalMismatchCardInfo})
  }

  formateEmail(email){
    var a = email.split("@"); 
    var b = a[0];
    var newstr = "";
    for(var i in b){
     if(i>1 && i<b.length-1)newstr += "*";
     else newstr += b[i];
    }
    return newstr+"@"+a[1]
  }

  formatNumber(number){
    return number.replace(number.substring(6,9), "*******")
  }
  sendVerification(){
    this.setState({sendingVerification:true})
    if (this.props.mismatchCardInfo) {
      let _payload = {
        email: this.props.mismatchCardInfo.misMatch.email,
        phone_number: this.props.mismatchCardInfo.misMatch.phone_number,
        card_holder: this.props.mismatchCardInfo.clientcard.card_holder,
        card_holder: this.props.mismatchCardInfo.clientcard.card_holder,
        card_number: this.props.mismatchCardInfo.clientcard.card_number,
        card_loyalty: this.props.mismatchCardInfo.clientcard.card_loyalty,
        card_type: this.props.mismatchCardInfo.clientcard.card_type,
        card_status: this.props.mismatchCardInfo.clientcard.card_status,
      }
      this.props.sendCustomVerification(_payload)
      setTimeout(() => {
        this.setState({sendingVerification:false})
        this.setState({modalMismatchCardInfo:false})
      },500)
    }
  }

  goToProfile(){
    this.setState({modalMismatchCardInfo:false})
    this.props.navigation.navigate('PersonalInformation')
  }

  onSignupClick(){
    Alert.alert(
        'Warning',
        'This action will log you out from app.',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'Yes, Log me out!', onPress: () => this.props.logoutUser()},
        ],
        {cancelable: false},
    );
  }
  modalMismatchConnectCard(){
        // this.props.apiResponse(false)
        // this.props.apiResponseText('')
        return(
          <Modal isVisible={this.state.modalMismatchCardInfo}>
          <View style={{bottom:util.WP(10)}}>
            <View style={styles.modalClose}>
              <TouchableOpacity onPress={()=>{this.modalMismatchConnectCardToggler()}}>
                <Image style={{height:util.WP(10),width:util.WP(10)}} source={require('../../../../assets/close-round.png')} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.smallModalContainer}>
              <Text style={styles.modalTitle}>
              Card Details Mismatch
              </Text>
              <View style={{flexDirection:'column',marginTop:util.WP(2),borderColor:'#F2F2F2',borderTopWidth:1,borderBottomWidth:1,paddingTop:util.WP(3),paddingBottom:util.WP(3)}}>
                <Text style={{fontFamily: "Montserrat-SemiBold",fontSize: util.WP('3'),color:'#00355F',textAlign:'left'}}>
                  Your client Card does not match your client Stores Mobile App Information which you provided at sign-up for this app.
                </Text>

                <Text style={{marginTop:10,fontFamily: "Montserrat-SemiBold",fontSize: util.WP('3'),color:'#00355F',textAlign:'left'}}>
                 To proceed further, a verification code will be sent to:
                </Text>
                <Text style={{marginTop:5,fontFamily: "Montserrat-SemiBold",fontSize: util.WP('3'),color:'#FB7300',textAlign:'left'}}>
                  {this.formateEmail(this.props.mismatchCardInfo ? this.props.mismatchCardInfo.misMatch.email : '')}
                </Text>
                <Text style={{marginTop:5,fontFamily: "Montserrat-SemiBold",fontSize: util.WP('3'),color:'#FB7300',textAlign:'left'}}>
                 { this.formatNumber(this.props.mismatchCardInfo ? this.props.mismatchCardInfo.misMatch.phone_number:'')}
                </Text>

                <Text style={{marginTop:10,fontFamily: "Montserrat-SemiBold",fontSize: util.WP('3'),color:'#00355F',textAlign:'left'}}>
                 If the information above is your email address or phone number, then proceed with verification
                </Text>

                {this.state.sendingVerification ?
                  <View
                  style={{...styles.containerButton, width:'50%'}}
                  //onPress={ () => this.props.navigation.navigate('CardStep1')}
                >
                {util.Lumper({ lumper: true,color:"#fff" })}
                </View>
                :
                  <TouchableOpacity 
                    style={{...styles.modalBlueButton, width:'50%'}}
                    onPress ={() => this.sendVerification()}
                  >
                    <Text style={{fontSize: util.WP('4'),fontFamily:'Montserrat-SemiBold',color:'#fff'}}>Send Code</Text>
                  </TouchableOpacity>
                }

                <Text style={{marginTop:30,fontFamily: "Montserrat-SemiBold",fontSize: util.WP('3'),color:'#00355F',textAlign:'left'}}>
                  If you do not have access to the email address above, please visit <Text style={{color:'#FB7300'}}>www.clientcard.com</Text> to update your card details.
                </Text>

                <Text style={{marginTop:10,fontFamily: "Montserrat-SemiBold",fontSize: util.WP('3'),color:'#00355F',textAlign:'left'}}>
                  You can also change your client Stores Mobile App phone number <Text onPress={() => this.goToProfile()} style={{color:'#FB7300'}}>HERE</Text> or Sign up for a new client Card <Text onPress={() => this.onSignupClick()} style={{color:'#FB7300'}}>HERE</Text>.
                </Text>

              </View>
              <Text style={{color:this.props.apiResponseStatus ? 'green' : 'red'}}>
                {this.props.responseText}
              </Text>

              <TouchableOpacity 
                    style={styles.modalBlueButton}
                    onPress ={() => this.modalMismatchConnectCardToggler()}
                  >
                    <Text style={{fontSize: util.WP('4'),fontFamily:'Montserrat-SemiBold',color:'#fff'}}>Cancel</Text>
                  </TouchableOpacity>
            </View>
          
          </View>
        </Modal>
        );
      }

  render() {
    
    return (
      this.state.isMounted ?
      <ScrollView style={styles.container}>
      {this.modalMismatchConnectCard()}
        <View style={styles.yellowContainerLarge}>
          {/* <View style={styles.logoContainer}>
            <Image style={styles.headerLogo} source={require('../../../../assets/Logo.png')} />
          </View> */}
          <View style={{ alignItems: 'flex-start', flexDirection: 'row',marginTop: 35,marginLeft:util.WP('5'),height:60}}>
            <TouchableOpacity style={{marginRight:17}} onPress={() => this.props.navigation.goBack()}>
              <Image style={{height:util.WP(7),width:util.WP(7)}} source={require('../../../../assets/arrow-left.png')} />
            </TouchableOpacity>
            <Text style={styles.h1TitleBreak}>
              Unlock the full experience
            </Text>
          </View>
          <View style={{ alignItems: 'flex-start', flexDirection: 'row',marginTop: 10,marginLeft:27}}>
            <Text style={{fontSize:16,fontFamily:"Montserrat-Regular",color:'#00355F'}}>
              Connect your client Card
            </Text>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column',marginTop: 15,width:'95%',left:9}}>
            <TextInput
            style={{...styles.textInput, height:60}}
            placeholder={"Enter Card Number"}
            placeholderTextColor='#828282'
            keyboardType="numeric"
            value={this.state.cardNumber}
            onChangeText = {(text)=>{this.setState({cardNumber:text})}}
            >
            </TextInput>
            <TouchableOpacity
              style={{top:-37,left:util.WP('34')}}
                onPress={ () => this.props.navigation.navigate('ScanCard', {onGoBack: this.refresh})}
              >
              <Text style={{fontSize: 14,fontFamily:'Montserrat-Bold',color:'#FB7300'}}>Scan Card</Text>
            </TouchableOpacity>
          
          </View>

        </View>

        <View style={{top:-util.WP('13')}}>
          <View style={{alignItems:'flex-start', backgroundColor:'#FCD504'}}><Text style={{marginLeft:12,marginRight:12, marginBottom:5,color:this.props.apiResponseStatus ? 'green' : 'red'}}>{this.props.responseText}</Text></View>
            <View style={{ left:10,width:'95%',alignItems: 'center', justifyContent: 'center', flexDirection: 'row',marginTop: 10}}>
                  <TouchableOpacity
                   style={styles.containerButton}
                   //onPress={ () => this.props.navigation.navigate('CardStep1')}
                   onPress={this.connectCard}
                 >
                 {this.props.lumperShown ? util.Lumper({ lumper: true,color:'#fff' })
                 :<Text style={{fontSize: 16,fontFamily:'Montserrat-SemiBold',color:'#fff'}}>CONNECT</Text>}
                 </TouchableOpacity>
            </View>
        </View>

        <View style={{width:'95%',left:10}}>
            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column',marginTop: 20}}>
                  <View style={{marginBottom:20,marginLeft:10,alignSelf:'flex-start'}}>
                    <Text style={styles.h1Title}>
                          Don't have a client Card?
                    </Text>
                  </View>
                  <TouchableOpacity
                   style={{...styles.containerButton, backgroundColor:'#FB7300'}}
                   onPress={ () => this.props.navigation.navigate('CardStep1')}
                 >
                 <Text style={{fontSize: 16,fontFamily:'Montserrat-Bold',color:'#00355F'}}>CREATE INSTANT CARD NOW!</Text>
                 </TouchableOpacity>
                 {/* <Image style={{width:85,height:22,marginTop:100,marginLeft:16,}} source={require('../../../../assets/Logo.png')} />
                <Image style={styles.subHead} source={require('../../../../assets/subhead.png')} /> */}
            </View>
        </View>
      </ScrollView>
      :
      <View></View>
    );
  }
}

mapStateToProps = state => {
  return {
      lumperShown: state.ui.isLoading,
      user:state.login.user,
      apiResponseStatus: state.ui.apiResponse,
      responseText: state.ui.responseText,
      apiResponseCode: state.ui.apiResponseCode,
      mismatchCardInfo:state.login.mismatchCardInfo
  }
}
mapDispatchToProps = dispatch => {
  return {
    connectCard: (cardNumber) => dispatch(TASKS.connectCard(cardNumber)),
    apiResponseText: (message) => dispatch(TASKS.apiResponseText(message)),
    logoutUser: () => dispatch(TASKS.logoutUser()),
    apiResponse: (status) => dispatch(TASKS.apiResponse(status)),
    setApiResponseCode: (code) => dispatch(TASKS.apiResponseCode(code)),
    sendCustomVerification: payload => dispatch(TASKS.sendCustomVerification(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectCard);
