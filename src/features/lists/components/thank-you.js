import React, { Component } from 'react';
import {
  Image,
  FlatList,
  Button,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { styles } from '../../../styles';
import * as util from '../../../utilities';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import analytics from '@react-native-firebase/analytics';

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Lists' })],
});

class ThankYou extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <Image
        style={styles.parentHeaderLogo}
        resizeMode="contain"
        source={require('../../../../assets/Logo.png')}
      />
    ),
    headerLeft: null,
  });
  constructor(props){
    super(props)

    this.state={
      storeName:null,
      deliveryCompanyName:null
    }

    this.screenanalytics();
  }

  async screenanalytics() {
    await analytics().logScreenView({screen_name:'OrderSuccessScreen'});
  }
  componentDidMount(){
    console.log('orderRequest', this.props.orderRequest)
    if (this.props.orderRequest.delivery_details.delivery_method == 'delivery') {
      this.props.clientStores.map((store) => {
        if (store.id == this.props.orderRequest.delivery_details.store_id) {
          this.setState({storeName: store.name})
          if (store.delivery_companies) {
            store.delivery_companies.map((deliveryCompany)=>{
              if (deliveryCompany.id == this.props.deliveryCompany) {
                this.setState({deliveryCompanyName:deliveryCompany.name})
              }
            })
          }else{  
            this.setState({deliveryCompanyName:store.delivery_company_name})
          }
        }
      })
    }
  }
  render() {
    return (
      <View style={{ backgroundColor: '#fff', flex: 1 }}>
        <View style={styles.blueContainerSmall}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems:'center',
              marginLeft: 20,
              marginRight: 25,
              marginTop: util.HP(3),
              marginBottom: util.HP(3),
            }}
          >
            <Text style={styles.h1ListTitle}>Thank you!</Text>
          </View>
        </View>
        <View style={{ marginHorizontal: 40, marginTop: 20 }}>
          <Text
            style={{
              color: '#004678',
              fontSize: util.HP('2.1'),
              fontFamily: 'Montserrat-Bold',
            }}
          >
            Your digital order number
          </Text>
          <Text
            style={{
              color: '#f58121',
              fontSize: util.HP('3.9'),
              fontFamily: 'Montserrat-Bold',
              letterSpacing: 1,
            }}
          >
            #{this.props.navigation.state.params.orderNumber}
          </Text>

          {this.props.orderRequest.delivery_details.delivery_method == 'delivery' ? 
              <Text
            style={{
              color: '#004678',
              fontSize: util.WP('3.5'),
              fontFamily: 'Montserrat-Bold',
              letterSpacing: 1,
              marginTop: util.WP(3),
            }}
          >
            Delivery for <Text style={{color: '#f58121'}}>{this.state.storeName}</Text> is provided by <Text style={{color: '#f58121'}}>{this.state.deliveryCompanyName}</Text>
          </Text>
             : null}
          <Text
            style={{
              marginTop: util.WP(2),
              fontSize: util.WP(3.5),
              fontFamily: 'Montserrat-SemiBold',
              color: '#004678',
              marginBottom: 10
            }}
          >
            {this.props.orderData.order_settings.completion_text}
          </Text>

          {this.props.orderRequest.delivery_details.delivery_method == 'delivery' ? 
          <Text
            style={{
              marginTop: util.WP(2),
              fontSize: util.WP(3.5),
              fontFamily: 'Montserrat-SemiBold',
              color: '#004678',
              marginBottom: 10
            }}
          >
            {this.props.orderData.order_settings.delivery_customer_notice_text}
          </Text>
          :
          <Text
            style={{
              marginTop: util.WP(2),
              fontSize: util.WP(3.5),
              fontFamily: 'Montserrat-SemiBold',
              color: '#004678',
              marginBottom: 10
            }}
          >
            {this.props.orderData.order_settings.pickup_customer_notice_text}
          </Text>
        }
           <TouchableOpacity
                style={[styles.containerButton, { backgroundColor: '#f58121',marginTop:15 }]}
                onPress={() => this.props.navigation.dispatch(resetAction)}
              >
                
                  <Text style={{fontSize: 16,fontFamily: 'Montserrat-SemiBold',color: '#fff',}}>
                    Continue
                  </Text>
                
              </TouchableOpacity>
        </View>
      </View>
    );
  }
}
mapStateToProps = state => {
  return {
      lumperShown: state.ui.isLoading,
      user:state.login.user,
      clientStores: state.login.stores,
      orderRequest: state.Lists.orderRequest,
      orderData: state.Lists.orderData,
      deliveryCompany:state.Lists.deliveryCompany
  }
}
mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThankYou);