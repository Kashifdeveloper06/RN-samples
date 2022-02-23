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
    title: "1 Free Waitrose Reusable...",
    description:'Scan your coupons for...',
    time:'02/29/2019 09:35 AM',
    price:'45.00',
    points:'+32',
  },
  {
    title: "1 Free Waitrose Reusable...",
    description:'Scan your coupons for...',
    time:'02/29/2019 09:35 AM',
    price:'45.00',
    points:'+32',
  },
  {
    title: "1 Free Waitrose Reusable...",
    description:'Scan your coupons for...',
    time:'02/29/2019 09:35 AM',
    price:'45.00',
    points:'+32',
  },
  {
    title: "1 Free Waitrose Reusable...",
    description:'Scan your coupons for...',
    time:'02/29/2019 09:35 AM',
    price:'45.00',
    points:'+32',
  },
  {
    title: "1 Free Waitrose Reusable...",
    description:'Scan your coupons for...',
    time:'02/29/2019 09:35 AM',
    price:'45.00',
    points:'+32',
  },
];
export default class PurchaseHistory extends React.Component {
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
                Purchase History
              </Text>
          </View>
        </View>
          <FlatList
           style={styles.flatListStyle1}
            data={this.state.data}
            renderItem={({ item: rowData }) => {
              return (
                <TouchableOpacity onPress={() => this.props.navigation.navigate('PurchaseHistoryDetail')}>
                    <View style={styles.purchaseHistoryContainer}>
                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                            <Text style={styles.notificationTitle}>
                            {rowData.title}
                            </Text>
                            <Text style={{fontFamily: "Montserrat-SemiBold",fontSize: util.WP('5'),color:'#FB7300',textAlign:'center'}}>
                            ${rowData.price}
                            </Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                            <Text style={styles.notificationDesc}>
                            {rowData.description}
                            </Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                            <Text style={{fontFamily: "Montserrat-Regular",fontSize: util.WP('3'),color:'#9D9D9D',textAlign:'center'}}>
                            {rowData.time}
                            </Text>
                            <Text style={{fontFamily: "Montserrat-Regular",fontSize: util.WP('3'),color:'#9D9D9D',textAlign:'center'}}>
                            {rowData.points} Points
                            </Text>
                        </View>  
                    </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item, index) => index}
          />
      </ScrollView>
    );
  }
}

