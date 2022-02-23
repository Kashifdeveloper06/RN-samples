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
import DatePicker from 'react-native-datepicker';
import { styles } from '../../../styles';
import * as util from '../../../utilities';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNPickerSelect from 'react-native-picker-select';
import { connect } from 'react-redux';
import * as TASKS from '../../../store/actions';

class CardPickup extends Component {
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

  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      location: '',
      isLocationerror: false,
      isFetching: false,
      prevRoute: '',
    };
  }

  componentDidMount() {
    let _prevRoute = this.props.navigation.dangerouslyGetParent().state
      .routes[1].routeName;
    console.log('prev Route', _prevRoute);
    if (_prevRoute == 'CardDetail') {
      this.setState({ prevRoute: _prevRoute });
    }
    console.log('current locations', this.props.locations);
    if (this.props.locations && this.props.locations.length > 0) {
      let _locations = [];
      this.props.locations.map((location, i) => {
        let _location = {
          label: location.location,
          value: location.mlid,
        };
        _locations.push(_location);
      });
      this.setState({ locations: _locations });
      this.setState({ location: '' });
    }
  }

  getIndex(value, arr, prop) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][prop] === value) {
        return i;
      }
    }
    return -1; //to handle the case where the value doesn't exist
  }
  handleSubmit() {
    this.setState({ isLocationerror: false });
    if (this.state.location) {
      var _index = this.getIndex(
        this.state.location,
        this.state.locations,
        'value'
      );
      let _location = this.state.locations[_index];
      console.log('_location', _location);
      if (_location) {
        let _payload = {
          location: _location,
          card_loyalty: this.props.user.clientcard.card_loyalty,
        };
        console.log('payload', _payload);
        util.isOnline(
          () => {
            this.props.requestEmbosedCard(_payload);
          },
          () => {
            util.showToast(util.INTERNET_CONNECTION_ERROR);
          }
        );
      }
    } else {
      this.setState({ isLocationerror: true });
    }
  }

  render() {
    const { isFetching, prevRoute } = this.state;
    return (
      <KeyboardAwareScrollView style={styles.container}>
        <View
          style={{ ...styles.yellowContainerMedium, height: util.WP('55') }}
        >
          <View
            style={{
              alignItems: 'flex-start',
              flexDirection: 'row',
              marginTop: 35,
              marginLeft: util.WP('5'),
            }}
          >
            <Text style={{ ...styles.h1TitleBreak, width: '90%' }}>
              Choose pickup location to get physical card
            </Text>
          </View>
        </View>
        <View
          style={{
            top: -util.WP('30'),
            width: '95%',
            left: 10,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              alignItems: 'stretch',
              backgroundColor: '#fff',
              justifyContent: 'center',
              flexDirection: 'column',
              marginTop: 15,
            }}
          >
            <View style={{ height: 60, width: '100%', marginTop: 1 }}>
              <View style={{ ...styles.labelInput }}>
                <Text style={styles.labelTextInput}>City/Area</Text>
              </View>
              <RNPickerSelect
                onValueChange={(value) => {
                  if (value && value != this.state.location) {
                    console.log('value', value);
                    this.setState({ location: value });
                  }
                }}
                value={this.state.location}
                placeholder={{ label: 'Select...' }}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: styles.textInput,
                  inputAndroid: { ...styles.textInput, fontSize: 14 },
                  placeholder: {
                    color: 'black',
                    fontSize: Platform.OS === 'ios' ? 16 : 14,
                  },
                  viewContainer: {
                    paddingLeft: Platform.OS === 'android' ? 12 : 0,
                    borderColor: Platform.OS === 'ios' ? '#F2F2F2' : '#828282',
                    borderBottomWidth: 1,
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
                items={this.state.locations}
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
              {isFetching ? (
                <View
                  style={{
                    position: 'absolute',
                    height: 50,
                    top: '30%',
                    right: 0,
                    left: 0,
                  }}
                >
                  {util.Lumper({ lumper: true, color: '#00355F', size: 15 })}
                </View>
              ) : (
                <View />
              )}
            </View>
          </View>
          {this.state.isLocationerror ? (
            <View
              style={{
                alignItems: 'flex-start',
                marginLeft: 12,
                marginBottom: 15,
              }}
            >
              <Text style={{ fontFamily: 'Montserrat-SemiBold', color: 'red' }}>
                Please select location
              </Text>
            </View>
          ) : (
            <View />
          )}
          <View
            style={{
              alignItems: 'flex-start',
              justifyContent: 'center',
              flexDirection: 'column',
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              style={styles.containerButton}
              onPress={() => this.handleSubmit()}
            >
              {this.props.lumperShown && !isFetching ? (
                util.Lumper({ lumper: true, color: '#fff' })
              ) : (
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Montserrat-SemiBold',
                    color: '#fff',
                  }}
                >
                  SET PICKUP LOCATION
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: util.WP('5'),
            }}
          >
            {prevRoute != '' && prevRoute == 'CardDetail' ? (
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Montserrat-SemiBold',
                    color: '#FB7300',
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('CardSuccess')}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Montserrat-SemiBold',
                    color: '#FB7300',
                  }}
                >
                  SKIP...
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

mapStateToProps = (state) => {
  return {
    lumperShown: state.ui.isLoading,
    user: state.login.user,
    locations: state.login.cardPickupLocations,
  };
};
mapDispatchToProps = (dispatch) => {
  return {
    getPickupLocations: (card_loyalty) =>
      dispatch(TASKS.getPickupLocations(card_loyalty)),
    requestEmbosedCard: (payload) =>
      dispatch(TASKS.requestEmbosedCard(payload)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardPickup);
