import React, { Component } from 'react';
import {
  Image,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Share,
  Platform,
  StyleSheet,
  TextInput
} from 'react-native';
import { styles } from '../../../styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as util from '../../../utilities';
import * as TASKS from '../../../store/actions';
import SVGCardBaseLogo from '../../client-card/components/CardBaseLogo';
import { connect } from 'react-redux';
import analytics from '@react-native-firebase/analytics';

class DeliveryNotices extends Component {
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
    this.state ={
      cardNumber:this.props.user.clientcard ? this.props.user.clientcard.card_loyalty : '',
      cardRequired:this.props.orderData.order_settings.client_card_required,
      cardError:false,
      refresh:false,
    }
    this.screenanalytics();
  }

  async screenanalytics() {
    await analytics().logScreenView({screen_name:'OrderDeliveryNoticeScreen'});
  }
  componentDidMount(){
    this.willFocusListner = this.props.navigation.addListener('willFocus',() => {
      console.log('user in order', this.props.user)
      this.props.getOrderStatus()
      this.setState({
        cardNumber:this.props.user.clientcard ? this.props.user.clientcard.card_loyalty : '',
        cardError:false
      })
    })
  }
  componentWillUnmount() {
    this.willFocusListner.remove();
  }
  onNext(){
    if (this.props.orderData.order_settings.client_card_required) {
      this.setState({cardError:false})  
      if (!this.state.cardNumber) {
        this.setState({cardError:true})
      }else{
        this.props.updateOrderCardNumber(this.state.cardNumber)
        this.props.navigation.navigate('OrderServices')
      }
    }else{
      this.setState({cardError:false})
      this.props.updateOrderCardNumber(this.state.cardNumber)
      this.props.navigation.navigate('OrderServices')
    }

  }
  render() {
    return (
       <KeyboardAwareScrollView 
        style={styles.container}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="always"
        getTextInputRefs={() => {
            return [
              this._cardNumberTI,
            ];
          }}

      >
      <SafeAreaView style={{ backgroundColor: '#f8f8f8' }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
          <View style={styles.blueContainerSmall}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginLeft: 20,
                marginRight: 25,
                marginTop: util.HP(3),
                marginBottom: util.HP(3),
              }}
            >
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => this.props.navigation.goBack()}
              >
                <Image
                  style={{ height: util.WP(7), width: util.WP(7) }}
                  source={require('../../../../assets/arrow-left-white.png')}
                />
              </TouchableOpacity>
              <Text style={styles.h1ListTitle}>client Stores Ordering</Text>
            </View>
          </View>
          <View style={{ marginHorizontal: 20 }}>
            
              <View style={{ marginVertical: 30 }}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    fontSize: util.HP('2.6'),
                    color: '#f58121',
                  }}
                >
                  Welcome to client Stores Order Services
                </Text>
                <Text
                  style={{
                    fontSize: util.HP(1.9),
                    color: 'grey',
                  }}
                >
                  {this.props.orderData.order_settings.welcome_text}
                </Text>
              </View>
          </View>
          
            <View>
              <View
              style={{
                ...styles.yellowContainerSmall,
                flexDirection: 'column',
                height: util.HP(14),
              }}
            >
              <TouchableOpacity
               // onPress={ () => this.props.navigation.navigate('CardDetail')}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    bottom: 0,
                  }}
                >
                  <View
                    style={{
                      alignItems: 'flex-start',
                      overflow: 'hidden',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      marginTop: util.WP('5'),
                      backgroundColor: '#fff',
                      width: '90%',
                      height: util.WP('28'),
                      borderRadius: 16,
                    }}
                  >
                    <SVGCardBaseLogo width={106} height={100} />
                    <View style={{ marginTop: 14, marginRight: 15 }}>
                      <Text style={{...styles.h3Title, alignSelf:'flex-end'}}>client Points</Text>
                      
                        {this.props.user.clientcard && this.props.user.is_connected ? 
                          <Text
                              style={{
                                fontSize: util.HP('3'),
                                fontFamily: 'Montserrat-Bold',
                                color: '#FB7300',
                                textAlign: 'right',
                              }}
                            >
                          {this.props.user.clientcard && this.props.user.clientcard.points ? this.props.user.clientcard.points : '0'}
                          </Text>

                        :
                          <TouchableOpacity onPress={() =>this.props.navigation.navigate('ConnectCard')}>
                            <Text
                              style={{
                                fontSize: util.WP('2.5'),
                                fontFamily: 'Montserrat-Bold',
                                color: '#FB7300',
                                textAlign: 'right',
                                marginTop:5
                              }}
                            >
                              Connect or Create Your Card
                            </Text>
                          </TouchableOpacity>
                       }
                      
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: 'center' }}>

              <View style={{height:60,width:'100%'}}>
                        <TextInput
                    style={{
                      width: '90%',
                      padding: 15,
                      marginLeft:18,
                      borderWidth: 0.5,
                      borderColor: '#ced8e1',
                      backgroundColor: '#fff',
                      color: 'rgba(0,0,0,.4)',
                      fontFamily: 'Montserrat-Medium',
                    }}
                    placeholder="Enter Number Here"
                    placeholderTextColor="#828282"
                    value={this.state.cardNumber}
                    // onBlur={() => this.onFirstNameBlurCallBack()}
                    onChangeText={text => this.setState({cardNumber:text})}
                    // editable = {this.state.isEditingFirstName}
                    ref={r => {
                      this._cardNumberTI = r;
                    }}
                    keyboardType="number-pad"
                    returnKeyType={'done'}
                  />
              </View>
              {this.state.cardError ? 
              <View style={{flexDirection:'row',alignItems:'flex-start',width: '90%',marginTop:2,padding: 15, marginBottom:2}}>
                {this.props.user.clientcard && this.props.user.is_connected ?
                     
                     <Text style={{fontFamily:'Montserrat-Regular',color:'#FB7300', fontSize:util.WP(3)}}>
                       Enter your client Card number.
                     </Text>
                   :
                   <Text style={{fontFamily:'Montserrat-Regular',color:'#FB7300', fontSize:util.WP(3)}}>
                       Enter your client Card number. Don't have a client Card? Create instant card <Text onPress={() =>this.props.navigation.navigate('ConnectCard')} style={{fontFamily:'Montserrat-SemiBold',color:'#083560'}}>Here</Text>
                     </Text>
                     
                   }
              </View>
              :null}
            </View>
          </View>
          
          
          
          <View style={{ marginHorizontal: 10 }}>
            <TouchableOpacity
              onPress={() =>  this.onNext()}
            >
              <View
                style={{
                  backgroundColor: '#083560',
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Montserrat-Bold',
                    fontSize: 16,
                  }}
                >
                  Proceed
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
      </KeyboardAwareScrollView>
    );
  }
}

mapStateToProps = state => {
  return {
      lumperShown: state.ui.isLoading,
      user:state.login.user,
      orderRequest: state.Lists.orderRequest,
      orderData: state.Lists.orderData
  }
}
mapDispatchToProps = dispatch => {
  return {
    updateOrderCardNumber: (cardNumber) => dispatch(TASKS.updateOrderCardNumber(cardNumber)),
    getOrderStatus: () => dispatch(TASKS.getOrderStatus()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryNotices);