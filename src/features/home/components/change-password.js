import React, { Component } from 'react';
import {Image,FlatList, Button, Text, TextInput, View,ScrollView,TouchableOpacity,StatusBar,Switch } from 'react-native';
import { Card } from "react-native-elements";
import { styles } from '../../../styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Swiper from 'react-native-swiper';
import * as util from '../../../utilities';
import Swipeout from 'react-native-swipeout';
import Modal from "react-native-modal";
import * as TASKS from '../../../store/actions';
import { connect } from 'react-redux';

class ChangePassword extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    //header: null,
    //headerMode: 'none',
    //gestures: null,
    //gesturesEnabled: false,
    headerTitle: (
         <Image style={styles.parentHeaderLogo} resizeMode="contain" source={require('../../../../assets/Logo.png')} />
     ),
     headerLeft: null,
 });
    constructor(props) {
        super(props);
        this.state={
          currentPass:'',
          newPass:'',
          confirmPass:''
        }
    }
    validateFields = () => {
      if (this.state.newPass != this.state.confirmPass) {
          util.showToast("Passwords don't match. Please Retry.");
          return false;
      } else if (this.state.newPass == '' || this.state.currentPass == '' || this.state.currentPass == ''){
          util.showToast("Please fill in all the fields");
          return false;
      } 
      else {
          return true;
      }
  }
   changePass(){

    if (this.validateFields()) {
      var params = {
        current_password:this.state.currentPass,
        new_password:this.state.newPass,
    }
    this.props.changePassword(params)
    }

   }
  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.lightBlueContainerSmall}>
          <View style={{ flexDirection: 'row',justifyContent:"center",marginLeft:20,marginRight:25,marginTop:util.HP(3),marginBottom:util.HP(3)}}>
              <TouchableOpacity style={{marginRight:10}} onPress={() => this.props.navigation.goBack()}>
                <Image style={{height:util.WP(7),width:util.WP(7)}} source={require('../../../../assets/arrow-left-white.png')} />
              </TouchableOpacity>
              <Text style={styles.h1ListTitle}>
              Change Password
              </Text>
          </View>
        </View>
        <View style={{width:util.WP('94'),marginLeft:util.WP('3')}}>
            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column',marginTop: util.WP('5')}}>
                  <TextInput
                  style={{...styles.textInput, height:60}}
                  placeholder={"Current Password"}
                  placeholderTextColor='#828282'
                  secureTextEntry={true}
                  value = {this.state.currentPass}
                  onChangeText = {(text)=>{this.setState({currentPass:text})}}
                  />
                  <TextInput
                  style={{...styles.textInput, height:60}}
                  placeholder={"New Password"}
                  placeholderTextColor='#828282'
                  secureTextEntry={true}
                  value = {this.state.newPass}
                  onChangeText = {(text)=>{this.setState({newPass:text})}}
                  />
                  <TextInput
                  style={{...styles.textInput, height:60}}
                  placeholder={"Confirm Password"}
                  placeholderTextColor='#828282'
                  secureTextEntry={true}
                  value = {this.state.confirmPass}
                  onChangeText = {(text)=>{this.setState({confirmPass:text})}}
                  />
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row',marginTop: util.WP('8'),}}>
                <TouchableOpacity
                 style={styles.containerButton}
                 onPress={ () => this.changePass()}
               >
                 {this.props.lumperShown ? util.Lumper({ lumper: true,color:'#fff' })
                  :
                  <Text style={{fontSize: 16,fontFamily:'Montserrat-SemiBold',color:'#fff'}}>Save</Text>  
                }
               
               </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
    );
  }
}
mapStateToProps = state => {
  return {
      lumperShown: state.ui.isLoading,
      user:state.login.user,
  }
}
mapDispatchToProps = dispatch => {
  return {
    changePassword: (params) => dispatch(TASKS.changePassword(params)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
