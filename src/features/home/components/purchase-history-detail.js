import React, { Component } from 'react';
import {Image,FlatList, Button, Text, TextInput, View,ScrollView,TouchableOpacity,StatusBar,Switch } from 'react-native';
import { Card } from "react-native-elements";
import { styles } from '../../../styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Swiper from 'react-native-swiper';
import * as util from '../../../utilities';
import Swipeout from 'react-native-swipeout';
import Modal from "react-native-modal";

const data = [
  {
    title: "NESTEA Instant Lemon Iced Tea",
    price:'45.00',
    weight:'400g',
  },
  {
    title: "FRITO LAY Cheetos",
    price:'13.00',
    weight:'20g',
  },
  {
    title: "Snickers Sharing Size Unwrapped Bites Chocolate Candy",
    price:'121.00',
    weight:'200g',
  }
];
export default class PurchaseHistoryDetail extends React.Component {
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
        this.state = {
          data: data,
        };
    }
   
  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.orangeContainerMedium}>
          <View style={{ flexDirection: 'row',justifyContent:"center",marginLeft:20,marginRight:25,marginTop:util.HP(3),marginBottom:util.HP(3)}}>
              <TouchableOpacity style={{marginRight:10}} onPress={() => this.props.navigation.goBack()}>
                <Image style={{height:util.WP(7),width:util.WP(7)}} source={require('../../../../assets/arrow-left-white.png')} />
              </TouchableOpacity>
              <Text style={styles.h1ListTitle}>
                Check Details
              </Text>
          </View>
        </View>
        <View style={[styles.purchaseHistoryContainer,{marginBottom:util.WP(6),marginTop:util.WP(6),marginLeft:util.WP(3),marginRight:util.WP(3)}]}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Text style={styles.notificationTitle}>
                client Stores Super...
                </Text>
                <Text style={{fontFamily: "Montserrat-SemiBold",fontSize: util.WP('5'),color:'#FB7300',textAlign:'center'}}>
                $45.00
                </Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                <Text style={styles.notificationDesc}>
                Gopaul Lands Hardware And...
                </Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Text style={{fontFamily: "Montserrat-Regular",fontSize: util.WP('3'),color:'#9D9D9D',textAlign:'center'}}>
                02/29/2019 09:35 AM
                </Text>
                <Text style={{fontFamily: "Montserrat-Regular",fontSize: util.WP('3'),color:'#9D9D9D',textAlign:'center'}}>
                +34 points
                </Text>
            </View>  
        </View>
        <FlatList
        style={styles.flatListStyle1}
        data={this.state.data}
        renderItem={({ item: rowData }) => {
            return (
            <View style={styles.purchaseDetailContainer}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <Text style={{fontFamily: "Montserrat-Medium",fontSize: util.WP('4'),color:'#2E2E2E',width:util.WP('60')}}>
                    {rowData.title}
                    </Text>
                    <Text style={{fontFamily: "Montserrat-Medium",fontSize: util.WP('4'),color:'#2E2E2E'}}>
                    ${rowData.price}
                    </Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems:'flex-end'}}>
                    <Text style={{fontFamily: "Montserrat-Regular",fontSize: util.WP('3'),color:'#9D9D9D'}}>
                    {rowData.weight}
                    </Text>
                </View>  
            </View>
            );
        }}
        keyExtractor={(item, index) => index}
        />
      </ScrollView>
    );
  }
}

