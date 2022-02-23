import 'react-native-get-random-values';
import React, { Component } from 'react';
import {
  Image,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { styles } from '../../../styles';
import * as util from '../../../utilities';
import RNPickerSelect from 'react-native-picker-select';
// import Video from 'react-native-video';
import { connect } from 'react-redux';
import * as TASKS from '../../../store/actions';
import { WebView } from 'react-native-webview';
import analytics from '@react-native-firebase/analytics';

class Support extends Component {
  constructor() {
    super();
    this.state = {
      support: null,
      subject: '',
      subjectError: false,
      message: '',
      messageError: false,
    };
    this.screenanalytics();
  }

  async screenanalytics() {
    await analytics().logScreenView({screen_name:'SupportScreen'});
  }

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

  componentDidMount() {
    this.props.getCustomerCareInfo(this.props.user.user_info.country);
  }
  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.customerCareInfo) !==
      JSON.stringify(this.props.customerCareInfo)
    ) {
      this.setState({ customerCareInfo: this.props });
    }
  }

  async onEmailSend() {
    this.setState({ subjectError: false });
    this.setState({ messageError: false });
    this.props.apiResponse(false);
    this.props.apiResponseText('');

    if (!this.state.subject.length) {
      this.setState({ subjectError: true });
    }
    console.log('message', this.state.message.length);
    if (!this.state.message.length) {
      this.setState({ messageError: true });
    }

    if (
      this.state.subject.length > 0 &&
      this.state.message.length > 0 &&
      this.state.support
    ) {
      let email;
      if (this.state.support === 'CustomerFeedback') {
        email = this.props.customerCareInfo.customer_feedback_email;
      }
      if (this.state.support === 'clientCardSupport') {
        email = this.props.customerCareInfo.client_card_support_email;
      }
      if (this.state.support === 'TechSupport') {
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

  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: 20,
          flexGrow: 1,
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.lightBlueContainerSmall}>
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
              <Text style={styles.h1ListTitle}>Get Support</Text>
            </View>
          </View>

          <View style={{ marginHorizontal: 20, marginTop: util.WP(4) }}>
            {this.props.customerCareInfo ? (
              <View style={styles.smallModalContainer}>
                <Text style={styles.modalTitle}>Email Customer Care</Text>
                <Text
                  style={{
                    color: '#888',
                    fontFamily: 'Montserrat-SemiBold',
                    marginBottom: util.WP(5),
                    fontSize: util.WP(3),
                  }}
                >
                  Select the support you require or view videos below for common
                  issues.
                </Text>
                <Text style={[styles.labelTextInput, { marginTop: 10 }]} />
                <RNPickerSelect
                  onValueChange={(value) => {
                    this.setState({
                      support: value,
                    });
                  }}
                  // onDonePress={(val) => {
                  //   this.setState({
                  //     Support: value,
                  //   });
                  // }}
                  //placeholder={{label: this.props.country ?this.state.countriesData[this.props.country]:'Country (Required)'}}
                  //itemKey={this.props.country?this.props.country:""}
                  value={this.state.support}
                  placeholder={{ label: 'Select support type' }}
                  useNativeAndroidPickerStyle={false}
                  style={{
                    inputIOS: {
                      borderWidth: 1,
                      borderColor: '#f6f6f6',
                      borderRadius: 4,
                      paddingHorizontal: 10,
                      height: util.WP(10.6),
                    },
                    inputAndroid: {
                      paddingVertical: 10,
                      borderWidth: 1,
                      borderColor: '#f1f1f1',
                      paddingHorizontal: 10,
                      borderRadius: 4,
                      color: '#444',
                      height: util.WP(10.6),
                    },
                    placeholder: {
                      color: '#808080',
                      fontSize: Platform.OS === 'ios' ? 16 : 14,
                      fontFamily: 'Montserrat-Bold',
                    },
                    viewContainer: {
                      paddingLeft: Platform.OS === 'android' ? 12 : 0,
                      borderColor:
                        Platform.OS === 'ios' ? '#F2F2F2' : '#828282',
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
                {this.state.support && (
                  <>
                    {/*
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
                      {this.state.support === 'CustomerFeedback'
                        ? this.props.customerCareInfo.customer_feedback_email
                        : this.state.Support === 'clientCardSupport'
                        ? this.props.customerCareInfo.client_card_support_email
                        : this.state.Support === 'TechSupport'
                        ? this.props.customerCareInfo
                            .client_app_tech_support_email
                        : this.props.customerCareInfo.email}
                    </Text>
                  </View>*/}

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
                    {this.state.messageError ? (
                      <Text style={{ color: 'red' }}>Please enter message</Text>
                    ) : (
                      <Text />
                    )}
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
                        onPress={() => this.onEmailSend()}
                      >
                        <Text
                          style={{
                            fontSize: util.WP('4'),
                            fontFamily: 'Montserrat-SemiBold',
                            color: '#fff',
                          }}
                        >
                          Send
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

            <View style={{ marginTop: util.WP(9) }}>
              <Text style={styles.modalTitle}>
                How to Connect Your client Loyalty Card
              </Text>
              <WebView
                originWhitelist={['*']}
                source={{
                  html:
                    '<div style="padding:100% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/408215191?title=0&byline=0&portrait=1" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>',
                }}
                //source={{html:'<iframe src="https://player.vimeo.com/video/408215191" width="640" height="640" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>'}}
                style={{
                  backgroundColor: '#F2F2F2',
                  width: '100%',
                  height: util.WP(90),
                  marginBottom: util.WP(9),
                }}
              />

              <Text style={styles.modalTitle}>How to Make a Shopping List</Text>
              <WebView
                originWhitelist={['*']}
                source={{
                  html:
                    '<div style="padding:100% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/408214126?title=0&byline=0&portrait=0" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>',
                }}
                style={{
                  backgroundColor: '#F2F2F2',
                  width: '100%',
                  height: util.WP(90),
                  marginBottom: util.WP(9),
                }}
              />

              <Text style={styles.modalTitle}>
                Search for Products and get Product info
              </Text>

              <WebView
                originWhitelist={['*']}
                source={{
                  html:
                    '<div style="padding:100% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/408218631?title=0&byline=0&portrait=0" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>',
                }}
                style={{
                  backgroundColor: '#F2F2F2',
                  width: '100%',
                  height: util.WP(90),
                  marginBottom: util.WP(9),
                }}
              />
              <Text style={styles.modalTitle}>
                How to place a Grocery order
              </Text>
              <WebView
                originWhitelist={['*']}
                source={{
                  html:
                    '<div style="padding:100% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/408233858?title=0&byline=0&portrait=0" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>',
                }}
                style={{
                  backgroundColor: '#F2F2F2',
                  width: '100%',
                  height: util.WP(90),
                  marginBottom: util.WP(9),
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

mapStateToProps = (state) => {
  return {
    lumperShown: state.ui.isLoading,
    user: state.login.user,
    customerCareInfo: state.login.customerCareInfo,
    apiResponseStatus: state.ui.apiResponse,
    responseText: state.ui.responseText,
  };
};
mapDispatchToProps = (dispatch) => {
  return {
    getCustomerCareInfo: (country) =>
      dispatch(TASKS.fetchCustomerCareInfo(country)),
    apiResponse: (status) => dispatch(TASKS.apiResponse(status)),
    apiResponseText: (message) => dispatch(TASKS.apiResponseText(message)),
    sendCustomerCareEmail: (payload) =>
      dispatch(TASKS.sendCustomerCareEmail(payload)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Support);
