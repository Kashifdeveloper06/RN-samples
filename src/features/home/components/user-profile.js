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
import { Card } from 'react-native-elements';
import { styles } from '../../../styles';
import * as util from '../../../utilities';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Swiper from 'react-native-swiper';
import Modal from 'react-native-modal';
import * as TASKS from '../../../store/actions';
import { connect } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
import FastImage from 'react-native-fast-image'

class UserProfile extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    //header: null,
    //headerMode: 'none',
    //gestures: null,
    //gesturesEnabled: false,
    headerTitle: (
      <Image
        style={styles.parentHeaderLogo}
        resizeMode="contain"
        source={require('../../../../assets/Logo.png')}
      />
    ),
    headerLeft: null,
  });
  constructor(props) {
    super(props);
    this.state = {
      callModal: false,
      emailModal: false,
      image: this.props.user.user_info.image,
      goToNotifications: false,
      subject: '',
      subjectError: false,
      message: '',
      messageError: false,
      Support: null,
    };
  }
  shouldComponentUpdate(nextProps) {
    // console.log(nextProps)
    if (
      this.props.customerCareInfo &&
      JSON.stringify(nextProps.customerCareInfo) !==
        JSON.stringify(this.props.customerCareInfo)
    ) {
      return false;
    }
    return true;
  }
  componentDidUpdate(prevProps, PrevState) {
    if (PrevState.Support !== this.state.Support) {
      console.log(this.props.customerCareInfo);
    }
  }
  componentDidMount() {
    console.log('customer', this.props.user);
    if (this.props.user) {
      this.setState({image: this.props.user.user_info.image})
      // this.props.getCustomerCareInfo(this.props.user.user_info.country);
      // this.props.getNotificationsCount();
      this.willFocusListner = this.props.navigation.addListener(
        'willFocus',
        () => {
          this.props.getCustomerCareInfo(this.props.user.user_info.country);
          this.props.getNotificationsCount();
          this.props.FetchOrdersList();
          this.props.getNotifications();
        }
      );
    }
  }
  componentWillUnmount() {
    this.willFocusListner.remove();
  }
  capturePicture = () => {
    this.setState({ goToNotifications: false });
    util.getPicture(
      (image) => {
        var imageParam = {
          image: image.uri,
        };
        this.props.updateUserImage(imageParam);
        this.setState({ image: image.uri });
      },
      () => {}
    );
  };
  modalCallToggler() {
    this.setState({ callModal: !this.state.callModal });
  }
  modalEmailToggler() {
    this.setState({ subjectError: false });
    this.setState({ messageError: false });
    this.setState({ subject: '' });
    this.setState({ message: '' });
    this.setState({ Support: null });
    this.props.apiResponse(false);
    this.props.apiResponseText('');
    this.setState({ emailModal: !this.state.emailModal });
  }

  fetchNotifications = () => {
    this.setState({ goToNotifications: true });
    util.isOnline(
      () => {
        this.props.navigation.navigate('Notifications');
      },
      () => {
        util.showToast(util.INTERNET_CONNECTION_ERROR);
      }
    );
  };

  refresh() {
    this.props.getCustomerCareInfo(this.props.user.user_info.country);
  }

  modalCall() {
    return (
      <Modal isVisible={this.state.callModal} backdropTransitionOutTiming={0}>
        <View style={{ bottom: util.WP('30') }}>
          <View style={styles.modalClose}>
            <TouchableOpacity
              onPress={() => {
                this.modalCallToggler();
              }}
            >
              <Image
                style={{ height: util.WP(10), width: util.WP(10) }}
                source={require('../../../../assets/close-round.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.smallModalContainer}>
            <Text style={styles.modalTitle}>Call Customer Care</Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: util.WP(2),
                borderColor: '#F2F2F2',
                borderTopWidth: 1,
                borderBottomWidth: 1,
                paddingTop: util.WP(3),
                paddingBottom: util.WP(3),
              }}
            >
              <Text
                style={{
                  fontFamily: 'Montserrat-Bold',
                  fontSize: util.WP('3'),
                  color: '#00355F',
                  textAlign: 'left',
                }}
              >
                {this.props.customerCareInfo
                  ? this.props.customerCareInfo.phone
                  : ''}
              </Text>
            </View>
            <TouchableOpacity style={styles.modalBlueButton}>
              <Text
                style={{
                  fontSize: util.WP('4'),
                  fontFamily: 'Montserrat-SemiBold',
                  color: '#fff',
                }}
              >
                Call
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
  async onEmailSend() {
    this.setState({ subjectError: false });
    this.setState({ messageError: false });
    this.props.apiResponse(false);
    this.props.apiResponseText('');

    if (this.state.subject.length <= 0) {
      this.setState({ subjectError: true });
    }

    if (!this.state.message) {
      this.setState({ messageError: true });
    }

    if (
      this.state.subject.length > 0 &&
      this.state.message.length > 0 &&
      this.state.Support
    ) {
      let email;
      if (this.state.Support === 'CustomerFeedback') {
        email = this.props.customerCareInfo.customer_feedback_email;
      }
      if (this.state.Support === 'clientCardSupport') {
        email = this.props.customerCareInfo.client_card_support_email;
      }
      if (this.state.Support === 'TechSupport') {
        email = this.props.customerCareInfo.client_app_tech_support_email;
      }
      let _payload = {
        to: email,
        subject: this.state.subject,
        message: this.state.message,
      };
      util.isOnline(() => {
        this.props.sendCustomerCareEmail(_payload);
      }),
        () => {
          util.showToast(util.INTERNET_CONNECTION_ERROR);
        };
    }
  }
  modalEmail() {
    // this.props.apiResponse(false)
    // this.props.apiResponseText('')
    return (
      <Modal isVisible={this.state.emailModal} backdropTransitionOutTiming={0}>
        <View style={{ bottom: util.WP('30') }}>
          <View style={styles.modalClose}>
            <TouchableOpacity
              onPress={() => {
                this.modalEmailToggler();
              }}
            >
              <Image
                style={{ height: util.WP(10), width: util.WP(10) }}
                source={require('../../../../assets/close-round.png')}
              />
            </TouchableOpacity>
          </View>

          {this.props.customerCareInfo ? (
            <View style={styles.smallModalContainer}>
              <Text style={styles.modalTitle}>Email Customer Care</Text>
              <Text style={[styles.labelTextInput, { marginTop: 15 }]}>
                Select Support type
              </Text>
              <RNPickerSelect
                onValueChange={(value) => {
                  this.setState({
                    Support: value,
                  });
                }}
                // onDonePress={(val) => {
                //   this.setState({
                //     Support: value,
                //   });
                // }}
                //placeholder={{label: this.props.country ?this.state.countriesData[this.props.country]:'Country (Required)'}}
                //itemKey={this.props.country?this.props.country:""}
                value={this.state.Support}
                placeholder={{ label: 'Select support type' }}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: {
                    borderWidth: 1,
                    borderColor: '#f6f6f6',
                    borderRadius: 4,
                    paddingHorizontal: 10,
                  },
                  inputAndroid: {
                    borderWidth: 1,
                    borderColor: '#f1f1f1',
                    paddingHorizontal: 10,
                    borderRadius: 4,
                    color: '#444',
                  },
                  placeholder: {
                    color: '#808080',
                    fontSize: Platform.OS === 'ios' ? 16 : 14,
                    fontFamily: 'Montserrat-Bold',
                  },
                  viewContainer: {
                    paddingLeft: Platform.OS === 'android' ? 12 : 0,
                    borderColor: Platform.OS === 'ios' ? '#F2F2F2' : '#828282',
                    borderWidth: 1,
                  },
                  done: { color: '#fff' },
                  modalViewMiddle: {
                    backgroundColor: '#004678',
                    fontFamily: 'Montserrat-Bold',
                    fontSize: 14,
                  },
                  modalViewBottom: { backgroundColor: '#fff', color: '#fff' },
                  iconContainer: {
                    top: 15,
                    right: 12,
                  },
                }}
                items={[
                  {
                    label: 'client Card | Connect my Card',
                    value: 'clientCardSupport',
                  },
                  { label: 'Customer Feedback', value: 'CustomerFeedback' },
                  { label: 'App Technical Support', value: 'TechSupport' },
                ]}
                Icon={() => {
                  return (
                    <Image
                      source={require('../../../../assets/angleDown.png')}
                      style={{
                        width: 15,
                        height: 15,
                        resizeMode: 'contain',
                      }}
                    />
                  );
                }}
              />
              {this.state.Support && (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: util.WP(2),
                      borderColor: '#F2F2F2',
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                      paddingTop: util.WP(3),
                      paddingBottom: util.WP(3),
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Bold',
                        fontSize: util.WP('3'),
                        color: '#00355F',
                        textAlign: 'left',
                      }}
                    >
                      {this.state.Support === 'CustomerFeedback'
                        ? this.props.customerCareInfo.customer_feedback_email
                        : this.state.Support === 'clientCardSupport'
                        ? this.props.customerCareInfo.client_card_support_email
                        : this.state.Support === 'TechSupport'
                        ? this.props.customerCareInfo
                            .client_app_tech_support_email
                        : this.props.customerCareInfo.email}
                    </Text>
                  </View>
                  <TextInput
                    style={styles.modalTextInputNoBorders}
                    placeholder={'Subject'}
                    placeholderTextColor="#828282"
                    value={this.state.subject}
                    onChangeText={(text) => this.setState({ subject: text })}
                  />
                  {this.state.subjectError ? (
                    <Text style={{ color: 'red' }}>Please enter subject</Text>
                  ) : (
                    <Text />
                  )}
                  <TextInput
                    multiline={true}
                    style={{
                      height: util.WP(20),
                      borderWidth: 1,
                      borderColor: '#F2F2F2',
                    }}
                    numberOfLines={3}
                    value={this.state.message}
                    onChangeText={(text) => this.setState({ message: text })}
                  />
                  <Text
                    style={{
                      color: this.props.apiResponseStatus ? 'green' : 'red',
                    }}
                  >
                    {this.props.responseText}
                  </Text>

                  {this.props.lumperShown ? (
                    <View
                      style={styles.containerButton}
                      //onPress={ () => this.props.navigation.navigate('CardStep1')}
                    >
                      {util.Lumper({ lumper: true, color: '#fff' })}
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.modalBlueButton}
                      onPress={() =>
                        this.props.apiResponseStatus
                          ? this.modalEmailToggler()
                          : this.onEmailSend()
                      }
                    >
                      <Text
                        style={{
                          fontSize: util.WP('4'),
                          fontFamily: 'Montserrat-SemiBold',
                          color: '#fff',
                        }}
                      >
                        {this.props.apiResponseStatus ? 'OK' : 'Send'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          ) : (
            <View style={styles.smallModalContainer}>
              <Text style={styles.modalTitle}>Email Customer Care</Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: util.WP(2),
                  borderColor: '#F2F2F2',
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  paddingTop: util.WP(3),
                  paddingBottom: util.WP(3),
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    fontSize: util.WP('3'),
                    color: '#00355F',
                    textAlign: 'left',
                  }}
                >
                  No email is provided
                </Text>
              </View>
            </View>
          )}
        </View>
      </Modal>
    );
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        {this.modalCall()}
        {this.modalEmail()}
        <View style={styles.lightBlueContainerLarge}>
          <View
            style={{
              alignItems: 'flex-start',
              flexDirection: 'row',
              marginTop: util.WP('5'),
              marginLeft: util.WP('5'),
            }}
          >
            <TouchableOpacity
              style={{ marginRight: 17 }}
              onPress={() => this.props.navigation.goBack()}
            >
              <Image
                style={{ height: util.WP(7), width: util.WP(7) }}
                source={require('../../../../assets/arrow-left-white.png')}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: util.HP('2.6'),
                color: '#fff',
                textAlign: 'left',
              }}
            >
              My Profile
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginTop: util.WP('3'),
              marginLeft: util.WP('8'),
              marginRight: util.WP('24'),
            }}
          >
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginRight: util.WP(5),
              }}
            >
              {this.props.lumperShown && !this.state.goToNotifications ? (
                util.Lumper({ lumper: true })
              ) : (
                
                <FastImage
                    style={styles.profilePicture}
                    source={{
                        uri: this.state.image,
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
              )}
              {this.props.lumperShown ? null : (
                <TouchableOpacity
                  style={{ bottom: util.WP('8'), left: util.WP('10') }}
                  onPress={this.capturePicture}
                >
                  <Image
                    style={{ height: util.WP(7), width: util.WP(7) }}
                    source={require('../../../../assets/edit-profile.png')}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{ flexDirection: 'column', justifyContent: 'flex-start' }}
            >
              <Text
                style={{
                  fontFamily: 'Montserrat-Bold',
                  fontSize: util.WP('5'),
                  color: '#fff',
                  textAlign: 'left',
                }}
              >
                {this.props.user ? this.props.user.first_name : ''}{' '}
                {this.props.user ? this.props.user.last_name : ''}
              </Text>
              <Text
                style={{
                  fontFamily: 'Montserrat-Regular',
                  fontSize: util.WP('4'),
                  color: '#00355F',
                  textAlign: 'left',
                  marginTop: util.WP('2'),
                }}
              >
                {this.props.user ? this.props.user.user_info.phone_number : ''}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ top: -util.WP('18') }}>
          <View style={styles.profileDataContainer}>
            <TouchableOpacity
              onPress={() =>
                this.props.user.is_connected
                  ? this.props.navigation.navigate('CardDetail')
                  : this.props.navigation.navigate('ConnectCard')
              }
            >
              <View style={styles.profileDataItem}>
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    style={styles.profilePageIcon}
                    source={require('../../../../assets/logoSolo.png')}
                  />
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: util.WP('5'),
                      color: '#00355F',
                      textAlign: 'left',
                    }}
                  >
                    Points
                  </Text>
                </View>
                {this.props.user && this.props.user.is_connected ? (
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: util.WP('5'),
                      color: '#FB7300',
                      textAlign: 'center',
                    }}
                  >
                    {this.props.user.clientcard.points
                      ? this.props.user.clientcard.points
                      : '0'}
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: util.HP('1.5'),
                      fontFamily: 'Montserrat-Bold',
                      color: '#FB7300',
                      textAlign: 'right',
                    }}
                  >
                    Connect Card
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Orders')}
              // onPress={() => this.props.navigation.navigate('Notifications')}
            >
              <View style={styles.profileDataItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    style={styles.profilePageIcon}
                    source={require('../../../../assets/order.png')}
                  />
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: util.WP('5'),
                      color: '#00355F',
                      textAlign: 'left',
                    }}
                  >
                    Orders
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    fontSize: util.WP('5'),
                    color: '#FB7300',
                    textAlign: 'center',
                  }}
                >
                  {this.props.OrderList ? this.props.OrderList.length : '0'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.fetchNotifications}
              // onPress={() => this.props.navigation.navigate('Notifications')}
            >
              <View style={styles.profileDataItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    style={styles.profilePageIcon}
                    source={require('../../../../assets/notifications.png')}
                  />
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: util.WP('5'),
                      color: '#00355F',
                      textAlign: 'left',
                    }}
                  >
                    Notifications
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    fontSize: util.WP('5'),
                    color: '#FB7300',
                    textAlign: 'center',
                  }}
                >
                  {this.props.notificationsCount != null &&
                    this.props.notificationsCount.new_count != null &&
                    this.props.notificationsCount.new_count}
                </Text>
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('PurchaseHistory')}>
            <View style={styles.profileDataItem}>
                <View style={{flexDirection:'row'}}>
                    <Image style={styles.profilePageIcon} source={require('../../../../assets/history.png')}/>
                    <Text style={{fontFamily: "Montserrat-Bold",fontSize: util.WP('5'),color:'#00355F',textAlign:'left'}}>
                        Purchase History
                    </Text>
                </View>    
            </View>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('savings', { tab: 'coupons' })
              }
            >
              <View style={styles.profileDataItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    style={styles.profilePageIcon}
                    source={require('../../../../assets/coupon.png')}
                  />
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: util.WP('5'),
                      color: '#00355F',
                      textAlign: 'left',
                    }}
                  >
                    Your Coupons
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('PersonalInformation', {
                  onGoBack: this.refresh,
                })
              }
            >
              <View style={styles.profileDataItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    style={styles.profilePageIcon}
                    source={require('../../../../assets/personal-info.png')}
                  />
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: util.WP('5'),
                      color: '#00355F',
                      textAlign: 'left',
                    }}
                  >
                    Personal Information
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.profileDataContainer}>
            <TouchableOpacity
              onPress={() => {
                this.modalCallToggler();
              }}
            >
              <View style={styles.profileDataItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    style={styles.profilePageIcon}
                    source={require('../../../../assets/call.png')}
                  />
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: util.WP('5'),
                      color: '#00355F',
                      textAlign: 'left',
                    }}
                  >
                    Call Customer Care
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Support');
              }}
            >
              <View style={styles.profileDataItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    style={styles.profilePageIcon}
                    source={require('../../../../assets/email.png')}
                  />
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: util.WP('5'),
                      color: '#00355F',
                      textAlign: 'left',
                    }}
                  >
                    Get Support
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.profileDataContainer]}>
            <TouchableOpacity onPress={() => this.onSignOut()}>
              <View style={styles.profileDataItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    style={styles.profilePageIcon}
                    source={require('../../../../assets/logout.png')}
                  />
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: util.WP('5'),
                      color: '#00355F',
                      textAlign: 'left',
                    }}
                  >
                    Log out
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  async onSignOut() {
    this.props.logoutUser();
  }
}
mapStateToProps = (state) => {
  return {
    lumperShown: state.ui.isLoading,
    user: state.login.user,
    userImage: state.login.image,
    notificationsCount: state.login.notificationsCount,
    OrderList: state.login.OrderList,
    customerCareInfo: state.login.customerCareInfo,
    apiResponseStatus: state.ui.apiResponse,
    responseText: state.ui.responseText,
  };
};
mapDispatchToProps = (dispatch) => {
  return {
    updateUserImage: (imageParam) => dispatch(TASKS.updateUserImage(imageParam)),
    logoutUser: () => dispatch(TASKS.logoutUser()),
    getNotifications: () => dispatch(TASKS.fetchNotifications()),
    getNotificationsCount: () => dispatch(TASKS.getNotificationsCount()),
    getCustomerCareInfo: (country) =>
      dispatch(TASKS.fetchCustomerCareInfo(country)),
    apiResponse: (status) => dispatch(TASKS.apiResponse(status)),
    apiResponseText: (message) => dispatch(TASKS.apiResponseText(message)),
    sendCustomerCareEmail: (payload) =>
      dispatch(TASKS.sendCustomerCareEmail(payload)),
    FetchOrdersList: () => dispatch(TASKS.FetchOrdersList()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);
