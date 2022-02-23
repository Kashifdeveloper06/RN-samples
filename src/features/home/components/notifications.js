import React, { Component } from 'react';
import {Image,FlatList, Button, Text, TextInput, View,ScrollView,TouchableOpacity,StatusBar,Switch } from 'react-native';
import { Card } from "react-native-elements";
import { styles } from '../../../styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Swiper from 'react-native-swiper';
import { connect } from 'react-redux';
import * as util from '../../../utilities';
import * as TASKS from '../../../store/actions';
import Swipeout from 'react-native-swipeout';
import Modal from "react-native-modal";
import moment from 'moment';
import Barcode from 'react-native-barcode-builder';
import analytics from '@react-native-firebase/analytics';

class Notifications extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
         <Image style={styles.parentHeaderLogo} resizeMode="contain" source={require('../../../../assets/Logo.png')} />
     ),
     headerLeft: null,
   });

  constructor(props) {
        super(props);

        this.state = {
          allNotifications: this.props.allNotifications,
          offerModal:false,
          couponModal:false,
          textModal:false,
          listModal:false,
          textDetail: {},
          coupoDetails:false,
          detailObjectType: '',
          switchValue: false,
        };
        this.screenanalytics();
    }
    async screenanalytics() {
      await analytics().logScreenView({screen_name:'NotificationScreen'});
    }
    componentDidMount(){
      if (this.props.user) {
        this.props.getNotifications()
        this.willFocusListner = this.props.navigation.addListener('willFocus', () => {
          console.log('listner called')
          this.props.getNotifications()
        })  
      }
      
    }


    componentWillUnmount(){
      if (this.props.user) {
        this.willFocusListner.remove()
      }
    }
    getCouponDetails(coupon_id){
      var params = {
        coupon_id:coupon_id,
        detailFromNotification: true,
      }
        util.isOnline(() => {
    
        this.props.getCouponDetails(params)
    
      }, () => {
        util.showToast(util.INTERNET_CONNECTION_ERROR);
      })
    }

    getOfferDetails(promo_id, product_id){

      var params = {
        promo_id:promo_id,
      }
        util.isOnline(() => {
    
        this.props.getOfferDetails(params)
    
      }, () => {
        util.showToast(util.INTERNET_CONNECTION_ERROR);
      })
  }

  markNotificationRead(index,product_id){
    var obj = this.state.allNotifications.unread[index];
    this.state.allNotifications.read.push(obj);
    this.state.allNotifications.unread.splice(index,1)
    this.setState({ 
      refresh: !this.state.refresh
    })
    var toggleParams={
      object_id:product_id
    }
    this.props.updateNotification(toggleParams)
  }
  
    modalToggler(detailObject, index){
      if(detailObject.object == 'promotion') {
        // this.setState({ offerModal: !this.state.offerModal });
        this.navigateToSubDetails(detailObject.object_id);
        this.markNotificationRead(index, detailObject.id);
      } else if(detailObject.object == 'coupon') {
        this.setState({switchValue:false})
        this.getCouponDetails(detailObject.object_id);
        this.markNotificationRead(index, detailObject.id);
        this.setState({ couponModal: true });
        setTimeout(() => {
          this.setState({ couponModal: true });
        }, 500)
      } else if(detailObject.object == 'text') {
        this.setState({ textModal: !this.state.textModal, textDetail: detailObject });
        this.markNotificationRead(index, detailObject.id);
      }
    }

    navigateToSubDetails(promo_id){
      var params = {
        promo_id:promo_id
      }
        util.isOnline(() => {
  
          this.props.getPromotionDetails(params)
  
      }, () => {
        util.showToast(util.INTERNET_CONNECTION_ERROR);
      })
  }

    modalTogglerForReadNotis(detailObject, index){
      if(detailObject.object == 'promotion') {
        // this.setState({ offerModal: !this.state.offerModal });
        this.navigateToSubDetails(detailObject.object_id);
        // this.markNotificationRead(index, detailObject.id);
      } else if(detailObject.object == 'coupon') {
        this.setState({ couponModal: !this.state.couponModal });
        this.getCouponDetails(detailObject.object_id);
        // this.markNotificationRead(index, detailObject.id);
      } else if(detailObject.object == 'text') {
        this.setState({ textModal: !this.state.textModal, textDetail: detailObject });
        // this.markNotificationRead(index, detailObject.id);
      }
    }

    closeModal(objectType) {
      if(objectType == 'promotion') {
        this.setState({ offerModal: !this.state.offerModal });
      } else if(objectType == 'coupon') {
        this.setState({switchValue:false})
        this.setState({ couponModal: !this.state.couponModal });
      } else if(objectType == 'text') {
        this.setState({ textModal: !this.state.textModal });
      } else if(objectType == 'listModal') {
        this.setState({ listModal: !this.state.listModal });
      }
    }

    toggleCardScan = (value) => {
      this.setState({switchValue: value})
      if(this.props.couponDetails && this.props.couponDetails.coupon_detail) {
      var params = {
        coupon_id:this.props.couponDetails.coupon_detail.coupon_id,
      }
        util.isOnline(() => {
    
        this.props.toggleCardScan(params)
    
      }, () => {
        util.showToast(util.INTERNET_CONNECTION_ERROR);
      })
    }
   }

    componentDidUpdate(prevProps, prevState){
      if (this.props.couponDetails && JSON.stringify(prevProps.couponDetails) !== JSON.stringify(this.props.couponDetails)) {
        console.log('aa gya')
        this.setState({switchValue: this.props.couponDetails.coupon_detail.active})
      }
      if (JSON.stringify(prevProps.allNotifications) !== JSON.stringify(this.props.allNotifications)) {
        this.setState({allNotifications: this.props.allNotifications})
      }
    }

    selectListToAdd(product_id,modalType){
      this.closeModal(modalType)
      var productData = {
        product_id:product_id
      }
      this.props.navigation.navigate('SelectList',{productData:productData})
    }

    modalCoupon(){
      // this.setState({switchValue:this.props.couponDetails.coupon_detail.active})

      if(this.props.couponDetails!=null) {
        return (
          <Modal isVisible={this.state.couponModal}>
            
              
                <ScrollView style={{}}>
                  <View style={styles.modalClose}>
                    <TouchableOpacity onPress={()=>{this.closeModal('coupon')}}>
                      <Image style={{height:util.WP(10),width:util.WP(10)}}  source={require('../../../../assets/close-round.png')} />
                    </TouchableOpacity>
                  </View>
                  {moment(this.props.couponDetails.coupon_detail.end_date).format('YYYY-MM-DD') > moment().format("YYYY-MM-DD") ?
                  <View>
                  <View style={styles.couponModalContainer}>
                      <View style={{justifyContent:'center',alignItems:'center'}}>
                      <Image style={{width:util.WP(50),height:util.WP(50),resizeMode:'contain'}} source={this.props.couponDetails.coupon_detail.image ?{uri:this.props.couponDetails.coupon_detail.image}:require('../../../../assets/no-image.png')} />
                      </View>
        
                      <View style={styles.couponTitleContainer}>
                        <Text style={styles.h1SubTitle}>
                        {this.props.couponDetails.coupon_detail.title}  
                        </Text>
                      </View>
        
                      <View style={styles.couponSwitchContainer}>
                        <Text style={styles.couponSwitchText}>
                          Show on next card scan  
                        </Text>
                        <Switch
                        onValueChange = {this.toggleCardScan}
                        value = {this.state.switchValue}/>
                      </View>
                      <Text style={styles.couponExpiry}>Expires {moment(this.props.couponDetails.coupon_detail.end_date).format('MM/DD/YYYY')}</Text>
                      {this.state.switchValue ? 
                        <View style={styles.couponBarcodeContainer}>
                          <Barcode value={this.props.couponDetails.coupon_detail.barcode} height={60} lineColor="#FB7300" format={this.props.couponDetails.coupon_detail.barcode.length === 13 ? 'EAN13' : 'UPC' } flat />
                        </View>
                      : 
                        <View></View>
                      }

                      <Text style={styles.couponItemDescription}>
                {this.props.couponDetails.coupon_detail.description}
                </Text>

                  </View>
                  <View style={{backgroundColor:'#fff'}}>
                            <Text style={{...styles.h1Title,marginTop:util.WP('5'),marginLeft:5,}}>
                              Eligible products
                            </Text>
                          
                            { this.props.couponDetails.products.length==1?
                  <View style={styles.couponEligibleSingle}>
                  {/* <Image  source={require('../../../../assets/offer-item-image.png')} /> */}
                  <Image style={{width:util.WP(20),height:util.WP(20),resizeMode:'contain'}} source={this.props.couponDetails.products[0].images[0] ?{uri:this.props.couponDetails.products[0].images[0]}:require('../../../../assets/no-image.png')} />
                    <View style={styles.couponEligibleData}>
                      <Text style={styles.currentPrice}>
                        ${this.props.couponDetails.products[0].price}
                      </Text>
                      <Text style={styles.cardDetailSingle} >
                      {this.props.couponDetails.products[0].name}
                      </Text>
                      <TouchableOpacity
                      onPress={()=>this.selectListToAdd(this.props.couponDetails.products[0].product_id,'coupon')}
                         style={styles.addToListSingle}
                       >
                       <Text style={styles.btnaddToList}>Add To List</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                :
                <FlatList
                horizontal
                contentContainerStyle={{paddingLeft:5}}
                //style={styles.couponEligibleDouble}
                      data={this.props.couponDetails.products}
                      renderItem={({ item: rowData }) => {
                        return (
                        <Card
                          title={null}
                          containerStyle={styles.offerCard}>
                            <View>
                              <View style={styles.cardImageContainer}>
                                {/* <Image  style={styles.cardImageTabs} source={require('../../../../assets/sauce.png')} /> */}
                                <Image style={{width:util.WP(20),height:util.WP(20),resizeMode:'contain'}} source={rowData.images[0] ?{uri:rowData.images[0]}:require('../../../../assets/no-image.png')} />
                              </View>
                              <View style={{flexDirection:'row'}}>
                                <Text style={styles.currentPriceTabs}>
                                  ${rowData.price}
                                </Text>
                              </View>
                              <View>
                                  <Text style={styles.cardDetailTabs}>
                                  {rowData.name}
                                </Text>
                              </View>
                              <TouchableOpacity
                              onPress={()=>this.selectListToAdd(rowData.product_id)}
                                  style={styles.addToListTabs}
                                >
                                <Text style={styles.btnaddToList}>Add To List</Text>
                              </TouchableOpacity>
                            </View>
                        </Card>
                        );
                      }}
                      keyExtractor={(item, index) => index.toString()}
                    />
                }
                            {/* <View style={styles.modalEligibleSingle}>
                            <Image  source={require('../../../../assets/offer-item-image.png')} />
                              <View style={styles.couponEligibleData}>
                                <Text style={styles.currentPrice}>
                                  $19.99
                                </Text>
                                <Text style={styles.cardDetailSingle} >
                                  Gillette Fusion5 Power 
                                  men's (excludes disposables)
                                </Text>
                                <TouchableOpacity
                                   style={styles.addToListSingle}
                                 >
                                 <Text style={styles.btnaddToList}>Add To List</Text>
                                </TouchableOpacity>
                              </View>
                            </View> */}
                          </View>
                          </View>
                      :
                      <View style={styles.containerWhite}>
                        <View style={{...styles.loader, height:util.HP(40), backgroundColor:'#fff'}}>
                          <Text style={styles.noDataText}>This coupon has expired!</Text>
                        </View>
                      </View>

                  }
                 </ScrollView>
            

          </Modal>
        );
      }
      
}

modalText(){
  return(
    <Modal isVisible={this.state.textModal}>
    <View style={{bottom:util.WP('30')}}>
      <View style={styles.modalClose}>
        <TouchableOpacity onPress={()=>{this.closeModal('text')}}>
          <Image style={{height:util.WP(10),width:util.WP(10)}} source={require('../../../../assets/close-round.png')} />
        </TouchableOpacity>
      </View>
      <View style={styles.smallModalContainer}>
        <Text style={styles.modalTitle}>
        {this.state.textDetail.object_title}
        </Text>
        <View style={{flexDirection:'row',marginTop:util.WP(2),borderColor:'#F2F2F2',borderTopWidth:1,borderBottomWidth:1,paddingTop:util.WP(3),paddingBottom:util.WP(3)}}>
          <Text style={{fontFamily: "Montserrat-Bold",fontSize: util.WP('3'),color:'#00355F',textAlign:'left'}}>
          {this.state.textDetail.message}
          </Text>
        </View>
      </View>
    </View>
  </Modal>
  );
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
                Notifications
              </Text>
          </View>
        </View>
        {/*this.modalOffer()*/}
        {this.modalCoupon()}
        {this.modalText()}
        {
        this.state.allNotifications!=null && 
        (
          (this.state.allNotifications.read != null && this.state.allNotifications.read.length > 0 ) ||
          (this.state.allNotifications.unread!= null && this.state.allNotifications.unread.length > 0 )
        )
         
        ?
        <View>
          <FlatList
           style={styles.flatListStyle1}
            data={this.state.allNotifications.unread}
            extraData={this.state.refresh}
            renderItem={({ item: rowData,index }) => {
              return (
                <TouchableOpacity
                onPress={()=>{this.modalToggler(rowData, index)}}
                >
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',borderBottomWidth:1,paddingRight:util.WP('5'),borderColor:'#F2F2F2'}}>
                    <View style={styles.notificationView}>  
                        <Text style={styles.notificationTitle}>
                            {rowData.object_title}
                        </Text>
                        <Text numberOfLines={3} style={styles.notificationDesc}>
                            {rowData.message}
                        </Text>
                        <Text style={styles.notificationTime}>
                            {moment(rowData.created_at).fromNow()}
                            {/* 3 Hours Ago */}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.newNotificationButton}>
                        <Text style={{fontSize: util.HP('1.2'),fontFamily:'Montserrat-Medium',color:'#fff'}}>NEW</Text>
                    </TouchableOpacity>
                  </View>
                  </TouchableOpacity>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
          <FlatList
           style={{marginLeft:util.WP(3),marginRight:util.WP(3),marginBottom:util.WP(3),marginTop:util.WP(3),backgroundColor:'#fff'}}
            data={this.state.allNotifications.read}
            extraData={this.state.refresh}
            renderItem={({ item: rowData, index }) => {
              return (
                <TouchableOpacity
                onPress={()=>{this.modalTogglerForReadNotis(rowData, index)}}
                >
                <View style={styles.notificationView}>  
                  <Text style={styles.notificationTitleOld}>
                  {rowData.object_title}
                  </Text>
                  <Text numberOfLines={3} style={styles.notificationDesc}>
                  {rowData.message}
                  </Text>
                  <Text style={styles.notificationTime}>
                    {moment(rowData.created_at).fromNow()}
                    {/* 3 Hours Ago */}
                  </Text>
                </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
          :
          <View style={styles.unreadEmptyStyle}>
              <Text style={[styles.notificationTitle, { textAlign:'center',}]}>No Notifications</Text>
          </View>
     
               }          
      </ScrollView>
    );
  }
}

mapStateToProps = state => {
  return {
    allNotifications:state.login.fetchedNotifications,
    offerDetails:state.promotions.offerDetails,
    couponDetails:state.promotions.couponDetails,
    cardScan:state.promotions.cardScan,
    isGuestUser:state.login.isGuestUser,
  }
}
mapDispatchToProps = dispatch => {
  return {
    getNotifications: () => dispatch(TASKS.fetchNotifications()),
    updateNotification: (country) => dispatch(TASKS.updateNotification(country)),
    getPromotionDetails: (params) => dispatch(TASKS.promotionsDetails(params)),
    getCouponDetails: (params) => dispatch(TASKS.getCouponDetails(params)),
    toggleCardScan: (params) => dispatch(TASKS.toggleCardScan(params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);

