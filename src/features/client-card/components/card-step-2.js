import React, { Component } from 'react';
import {Image,FlatList, Button, Text, TextInput, View,ScrollView,TouchableOpacity } from 'react-native';
import { Card } from "react-native-elements";
import { styles } from '../../../styles';
import * as util from '../../../utilities';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Swiper from 'react-native-swiper';

export default class CardStep2 extends React.Component {
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
    }
    signUp = ()=>{
      alert('green')

    }
  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.yellowContainerLarge}>
          {/* <View style={styles.logoContainer}>
            <Image style={styles.headerLogo} source={require('../../../../assets/Logo.png')} />
          </View> */}
          <View style={{ alignItems: 'flex-start', flexDirection: 'row',marginTop: 35,marginLeft:util.WP('5'),height:60}}>
            <TouchableOpacity style={{marginRight:17}} onPress={() => this.props.navigation.goBack()}>
              <Image style={{height:util.WP(7),width:util.WP(7)}} source={require('../../../../assets/arrow-left.png')} />
            </TouchableOpacity>
            <Text style={styles.h1TitleBreak}>
              You're one step closer
            </Text>
          </View>
        </View>
        <View style={{top:-util.WP('48'),width:'95%',left:10}}>
           <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column',marginTop: 15}}>
                <TextInput
                style={styles.textInput}
                placeholder={"Country"}
                placeholderTextColor='#828282'
                />
                <TextInput
                style={styles.textInput}
                placeholder={"City"}
                placeholderTextColor='#828282'
                />
                <TextInput
                style={styles.textInput}
                placeholder={"Email"}
                keyboardType = 'email-address'
                placeholderTextColor='#828282'
                />
                <TextInput
                style={styles.textInput}
                placeholder={"Password"}
                secureTextEntry={true}
                placeholderTextColor='#828282'
                />
          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row',marginTop: 20,}}>
                <TouchableOpacity
                 style={styles.containerButton}
                 onPress={ () => this.props.navigation.navigate('CardSuccess')}
               >
               <Text style={{fontSize: 16,fontFamily:'Montserrat-SemiBold',color:'#fff'}}>SIGN UP</Text>
               </TouchableOpacity>
          </View>
        </View>
        {/* <View style={styles.footerLogo}>
                <Image style={styles.headerLogo} source={require('../../../../assets/Logo.png')} />
                <Image style={styles.subHead} source={require('../../../../assets/subhead.png')} />
        </View> */}
      </ScrollView>
    );
  }
}

