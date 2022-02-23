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
  TextInput,
} from 'react-native';
import { styles } from '../../../styles';
import * as util from '../../../utilities';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class OrderServices extends Component {
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
  constructor() {
    super();
    this.state = {
      quantity: [],
      QuantityError: false,
      QuantityErrorText: '',
    };
  }
  handleQuantity = value => {
    this.setState(prevState => ({
      quantity: [...this.state.quantity, value],
    }));
    this.setState({
      QuantityError: true,
      QuantityErrorText: 'Please enter quantity',
    });
  };

  handleNextStep() {
    if (this.state.quantity.length) {
      this.props.navigation.navigate('DeliveryNotices');
    } else {
      this.setState({
        QuantityError: true,
        QuantityErrorText: 'Please enter quantity',
      });
    }
  }

  render() {
    return (
      <SafeAreaView style={{ backgroundColor: '#f8f8f8', flex: 1 }}>
        <KeyboardAwareScrollView
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: util.HP(18),
          }}
          scrollIndicatorInsets={false}
        >
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
              <Text style={styles.h1ListTitle}>Enter Quantity</Text>
            </View>
          </View>
          <View style={{marginHorizontal: 10, flex: 1, marginTop: 15 }}>
            {this.state.QuantityError && (
              <Text
                style={{
                  ...styles.errorTextInput,
                  alignSelf: 'flex-start',
                }}
              >
                {this.state.QuantityErrorText}
              </Text>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottomWidth: 0.5,
                borderColor: '#ccc',
                paddingHorizontal: 15,
                paddingVertical: 10,
                backgroundColor: '#fff',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Montserrat-SemiBold',
                  color: '#004678',
                }}
              >
                Coca cola
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Montserrat-SemiBold',
                  color: '#FF7600',
                }}
              >
                $11.00 per KG
              </Text>
              <TextInput
                placeholder="0"
                keyboardType="number-pad"
                onEndEditing={value =>
                  this.handleQuantity(value.nativeEvent.text)
                }
                style={{
                  backgroundColor: '#004678',
                  color: '#FF7600',
                  textAlign: 'center',
                  width: util.WP(15),
                  height: util.WP(10),
                  fontFamily: 'Montserrat-Bold',
                }}
                placeholderTextColor="#FF7600"
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottomWidth: 0.5,
                borderColor: '#ccc',
                paddingHorizontal: 15,
                paddingVertical: 10,
                backgroundColor: '#fff',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Montserrat-SemiBold',
                  color: '#004678',
                }}
              >
                Coca cola
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Montserrat-SemiBold',
                  color: '#FF7600',
                }}
              >
                $11.00 per KG
              </Text>
              <TextInput
                placeholder="0"
                keyboardType="number-pad"
                onEndEditing={value =>
                  this.handleQuantity(value.nativeEvent.text)
                }
                style={{
                  backgroundColor: '#004678',
                  color: '#FF7600',
                  textAlign: 'center',
                  width: util.WP(15),
                  height: util.WP(10),
                  fontFamily: 'Montserrat-Bold',
                }}
                placeholderTextColor="#FF7600"
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottomWidth: 0.5,
                borderColor: '#ccc',
                paddingHorizontal: 15,
                paddingVertical: 10,
                backgroundColor: '#fff',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Montserrat-SemiBold',
                  color: '#004678',
                }}
              >
                Coca cola
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Montserrat-SemiBold',
                  color: '#FF7600',
                }}
              >
                $11.00 per KG
              </Text>
              <TextInput
                placeholder="0"
                keyboardType="number-pad"
                onEndEditing={value =>
                  this.handleQuantity(value.nativeEvent.text)
                }
                style={{
                  backgroundColor: '#004678',
                  color: '#FF7600',
                  textAlign: 'center',
                  width: util.WP(15),
                  height: util.WP(10),
                  fontFamily: 'Montserrat-Bold',
                }}
                placeholderTextColor="#FF7600"
              />
            </View>
            <View style={{ alignItems: 'center', marginTop: util.HP(3) }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '90%',
                }}
              >
                <Text
                  style={{ fontFamily: 'Montserrat-Bold', color: '#FF7600' }}
                >
                  your estimated total is
                </Text>
                <Text
                  style={{ fontFamily: 'Montserrat-Bold', color: '#FF7600' }}
                >
                  $2,500
                </Text>
              </View>
              <Text
                style={{
                  width: '90%',
                  marginTop: util.HP(5),
                  fontFamily: 'Montserrat-SemiBold',
                  color: '#ff7600',
                }}
              >
                Note that price can be subjected to change and your final cost
                will be tallied at collection.
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View
          style={{
            justifyContent: 'flex-end',
            flex: 1,
            position: 'absolute',
            bottom: 10,
            width: '100%',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: '#004678',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              width: '95%',
            }}
            onPress={() => this.handleNextStep()}
          >
            <Text style={{ color: '#fff', fontFamily: 'Montserrat-SemiBold' }}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
