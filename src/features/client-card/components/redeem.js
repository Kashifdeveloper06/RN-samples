import React, { Component } from 'react';
import {Image,FlatList, Button, Text, TextInput, View,ScrollView,TouchableOpacity,Alert } from 'react-native';
import * as util from '../../../utilities';
import { styles } from '../../../styles';
import * as TASKS from '../../../store/actions';
import Barcode from 'react-native-barcode-builder';
import { connect } from 'react-redux';




class Redeem extends React.Component {
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
        const isIphoneX = util.isIphoneX() ? true : false

        this.state = {
          redeeminfo: null
        }
      this.props.getRedeemInfo(this.props.user.user_info.country)  
    }

    componentDidMount(){

      // if (this.props.redeemInfo) {
      //   this.setState({redeemInfo: this.props.redeemInfo})  
      // }
      
    }
  render() {
    return(
        <ScrollView style={styles.containerWhite}>
          <View style={styles.orangeContainerMedium}>
             <View style={{ flexDirection: 'row',justifyContent:"center",marginLeft:20,marginTop:util.WP(5)}}>
              <TouchableOpacity style={{marginRight:10}} onPress={() => this.props.navigation.goBack()}>
                <Image style={{height:util.WP(7),width:util.WP(7)}} source={require('../../../../assets/arrow-left-white.png')} />
              </TouchableOpacity>
              <Text style={styles.h1ListTitle}>
                Redemption Info
              </Text>
             </View>
          </View>

          <View style={styles.promotionDetailContainer}>
            <Text style={styles.h1TitleFix}>
              {this.props.redeemInfo?this.props.redeemInfo.title:''}
            </Text>
            <Text style={{fontFamily:'Montserrat-Regular',color:'#2D2D2D',fontSize:util.WP('4'),marginTop:util.WP('6'),marginBottom:util.WP('6')}}>
            {this.props.redeemInfo?this.props.redeemInfo.description:'No Description Available!'}

            </Text>
          </View>

          
        </ScrollView>
      )
  }

 
}

mapStateToProps = state => {
  return {
      lumperShown: state.ui.isLoading,
      user:state.login.user,
      redeemInfo: state.login.redeemInfo
  }
}
mapDispatchToProps = dispatch => {
  return {
    getRedeemInfo: (countryCode) => dispatch(TASKS.redeemInfo(countryCode)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Redeem);

