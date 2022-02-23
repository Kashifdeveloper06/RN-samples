import React, { Component } from 'react';
import {Image,FlatList, Button, Text, TextInput, View,ScrollView,TouchableOpacity,TouchableWithoutFeedback } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Card } from "react-native-elements";
import { styles } from '../../../styles';
import * as util from '../../../utilities';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Swiper from 'react-native-swiper';
import { connect } from 'react-redux';
import * as TASKS from '../../../store/actions';

class CardSuccess extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
    headerMode: 'none',
    gestures: null,
    gesturesEnabled: false,
    
 });
    constructor(props) {
        super(props);
    }

    handleContinue(){
      this.props.setIsConnectCardRequest(false)
      this.props.navigation.navigate('Home')
    }
  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={{backgroundColor: '#FCD504'}}>
            <View style={{alignItems:'center',justifyContent:"center",backgroundColor:'#fff',marginTop:util.WP('15'),paddingBottom:util.WP('5'),marginLeft:util.WP('5'),height:util.HP(50),width:util.WP('90')}}>
                <Image style={{width:'100%',height:'100%',resizeMode:'contain'}} source={require('../../../../assets/card-success.png')} />
            </View>
        </View>
        <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',paddingTop:util.WP('10'),marginBottom:util.WP('5'),marginLeft:util.WP('5'),backgroundColor:'#fff',height:util.HP(30),width:util.WP('90')}}>
            <Text style={styles.onBoardTitle}>Congratulations!</Text>
            {
              this.props.isConnectCardRequest ? 
                <Text style={styles.onBoardSubTitle1}>
                  {'You have created your Digital client Stores Loyalty Card successfully. Now you can scan your card from your phone to get points and discounts!'}
                </Text>
              :

              this.props.user.clientcard.crd_em_status ? 
              <Text style={styles.onBoardSubTitle1}>
                {'Thank you for ordering your client Loyalty Card. A customer service representative will be in touch with you once it is ready for pick up.Feel free to use your Digital client Loyalty Card until then! Your card will be ready to use in approximately two(2) hours.' }
              </Text> 
              :
              <Text style={styles.onBoardSubTitle1}>
                {'You have created your Digital client Stores Loyalty Card successfully. Now you can scan your card from your phone to get points and discounts! \n Your card will be ready to use in approximately two(2) hours.'}
              </Text> 
             }
        </View>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',paddingBottom:util.WP('5')}}>
        <TouchableOpacity
                 onPress={ () => this.handleContinue()}
               >
               <Text style={{fontSize: 14,fontFamily:'Montserrat-SemiBold',color:'#FB7300'}}>Continue</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
mapStateToProps = state => {
  return {
      user: state.login.user,
      isConnectCardRequest: state.login.isConnectCardRequest
  }
}
mapDispatchToProps = dispatch => {
  return {
    setIsConnectCardRequest: (status) => dispatch(TASKS.setIsConnectCardRequest(status))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardSuccess);
