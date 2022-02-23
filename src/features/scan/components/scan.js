import React, { Component } from 'react';
import * as util from '../../../utilities';
import {
  Button,
  Text,
  View,
  Alert,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import { Card } from 'react-native-elements';
import { styles } from '../../../styles';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import * as TASKS from '../../../store/actions';
import analytics from '@react-native-firebase/analytics';

class Scan extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
    headerMode: 'none',
    gestures: null,
    gesturesEnabled: false,
    tabBarVisible: false,
  });
  constructor(props) {
    super(props);
    this.camera = null;
    this.barcodeCodes = [];

    this.state = {
      focusedScreen: false,
      isBarcode: false,
      scannedBarcode: '',
      camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: RNCamera.Constants.FlashMode.auto,
      },
    };
    this.props.resetBarcodeItemDetails();
    this.screenanalytics();
  }

  async screenanalytics() {
    await analytics().logScreenView({screen_name:'ProductScanScreen'});
  }
  componentDidMount() {
    const { navigation } = this.props;
    this.willFocusListener = navigation.addListener('willFocus', () =>
      this.setState({ focusedScreen: true })
    );
    this.willBlurListener = navigation.addListener('willBlur', () =>
      this.setState({
        focusedScreen: false,
        isBarcode: false,
        scannedBarcode: '',
      })
    );
    this.props.resetBarcodeItemDetails();
  }

  componentDidUpdate(prevProps) {
    console.log('prevProps', prevProps);
    if (
      this.props.details &&
      JSON.stringify(prevProps.details) !== JSON.stringify(this.props.details)
    ) {
      this.logScannerAnalyticsEvent();
    }
  }
  logScannerAnalyticsEvent() {
    if (this.props.details && this.props.details.products) {
      analytics().logEvent('ProductScanned', {
        name: this.props.details.products[0].name,
      });
    }
  }
  componentWillUnmount() {
    this.willFocusListener.remove();
    this.willBlurListener.remove();
  }
  onBarCodeRead(scanResult) {
    if (scanResult.data && scanResult.data == this.state.scannedBarcode) {
      return;
    }
    this.props.resetBarcodeItemDetails();
    this.setState({
      isBarcode: false,
    });
    this.setState({
      scannedBarcode: scanResult.data,
    });
    console.log('barcode', scanResult.data);
    if (scanResult.data != null && !this.props.lumperShown) {
      // if (!this.props.details) {
      //   if (this.props.details.length == 0) {
      var params = {
        barcode: scanResult.data,
        country_code: this.props.user.user_info.country,
      };
      util.isOnline(
        () => {
          this.props.getBarcodeProduct(params);
        },
        () => {
          util.showToast(util.INTERNET_CONNECTION_ERROR);
        }
      );
      //   }
      // }

      this.setState({
        isBarcode: true,
      });
    }
  }
  selectListToAdd(product_id) {
    var productData = {
      product_id: product_id,
    };
    this.props.navigation.navigate('SelectList', { productData: productData });
  }
  renderCard() {
    return this.props.details ? (
      this.props.details.products ? (
        this.props.details.products.length == 1 ? (
          <View style={styles.couponEligibleSingle}>
            {/* <Image  source={require('../../../../assets/offer-item-image.png')} /> */}
            <Image
              style={styles.cardImageTabs}
              source={
                this.props.details.products[0].images.length > 0
                  ? { uri: this.props.details.products[0].images[0] }
                  : require('../../../../assets/no-image.png')
              }
            />
            <View style={styles.couponEligibleData}>
              <Text style={styles.currentPrice}>
                ${this.props.details.products[0].old_price}
              </Text>
              <Text style={styles.cardDetailSingle}>
                {this.props.details.products[0].name}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  this.selectListToAdd(
                    this.props.details.products[0].product_id
                  )
                }
                style={styles.addToListSingle}
              >
                <Text style={styles.btnaddToList}>Add To List</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <ScrollView>
            <FlatList
              style={{ marginLeft: 18, marginBottom: 30 }}
              horizontal
              data={this.props.details.products}
              renderItem={({ item: rowData }) => {
                return (
                  <Card title={null} containerStyle={styles.offerCard}>
                    <View>
                      <View
                        style={{
                          textAlign: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                        }}
                      >
                        <Image
                          style={styles.cardImage}
                          source={
                            rowData.images.length > 0
                              ? { uri: rowData.images[0] }
                              : require('../../../../assets/no-image.png')
                          }
                        />
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.currentPrice}>
                          ${rowData.new_price}
                        </Text>
                        <Text style={styles.oldPrice}>
                          ${rowData.old_price}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.cardDetail}>
                          {rowData.name.trim()}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.addToList}
                        onPress={() => this.selectListToAdd(rowData.product_id)}
                      >
                        <Text
                          style={{
                            fontSize: util.HP('1.3'),
                            fontFamily: 'Montserrat-SemiBold',
                            color: '#00355F',
                          }}
                        >
                          Add To List
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Card>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />
          </ScrollView>
        )
      ) : (
        <View>
          {!this.props.lumperShown ? (
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: util.HP('2.8'),
                color: '#FFFFFF',
                textAlign: 'center',
                width: '100%',
              }}
            >
              No Items Found against{'\n'}
              {this.state.scannedBarcode}
            </Text>
          ) : null}
        </View>
      )
    ) : (
      <View />
    );
  }
  cameraStatus(status) {
    return (
      <View>
        <Text>{status}</Text>
      </View>
    );
  }
  cameraView() {
    return (
      <RNCamera
        ref={(ref) => {
          this.camera = ref;
        }}
        defaultTouchToFocus
        flashMode={this.state.camera.flashMode}
        mirrorImage={false}
        captureAudio={false}
        onBarCodeRead={this.onBarCodeRead.bind(this)}
        onFocusChanged={() => {}}
        notAuthorizedView={
          <View
            style={{
              flex: 1,
              alignItems: 'flex-start',
              justifyContent: 'center',
              width: '80%',
              marginLeft: 18,
            }}
          >
            <Text style={{ ...styles.h1Title, ...styles.orangeButtonText }}>
              Your Camera is Disabled!
            </Text>
            <Text style={{ ...styles.h3Title, marginLeft: 0 }}>
              client Stores requires your permission to access your camera.
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                style={{ ...styles.containerButton, width: '50%', padding: 10 }}
                onPress={() => Linking.openURL('app-settings://clientStores')}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Montserrat-SemiBold',
                    color: '#fff',
                  }}
                >
                  Enable From Settings
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.containerButton,
                  width: '20%',
                  padding: 10,
                  marginLeft: 5,
                }}
                onPress={() => this.props.navigation.navigate('Home')}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Montserrat-SemiBold',
                    color: '#fff',
                  }}
                >
                  Home
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        onZoomChanged={() => {}}
        onStatusChange={(status) => this.cameraStatus(status)}
        style={styles.cameraPreview}
        type={this.state.camera.type}
      >
        <View style={styles.scannerCancelContainer}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Image
              style={{ height: util.WP(7), width: util.WP(7) }}
              source={require('../../../../assets/close-white.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.scannerContentContainer}>
          <Text style={styles.scannerText}>
            Place the barcode in the frame to recognize the goods
          </Text>
          <Image
            style={{ marginRight: 10, height: util.WP(10), width: util.WP(10) }}
            source={require('../../../../assets/button-lightning.png')}
          />
        </View>
        <BarcodeMask
          edgeColor={'#FFD700'}
          width={util.WP('80')}
          height={util.WP('45')}
          showAnimatedLine={false}
        />
        <View
          style={{
            marginLeft: 20,
            marginRight: 10,
            top: util.HP('43'),
            width: '97%',
          }}
        >
          {/*Single Card*/}
          {this.props.lumperShown ? (
            <View style={{ paddingTop: 10 }}>
              {util.Lumper({ lumper: true, color: '#fff' })}
            </View>
          ) : null}
          {this.renderCard()}
        </View>
      </RNCamera>
    );
  }
  render() {
    return this.props.isGuestUser ? (
      <View style={styles.containerWhite}>
        <View
          style={{
            ...styles.loader,
            justifyContent: 'center',
            top: 0,
            marginLeft: 18,
          }}
        >
          <Text style={styles.noDataText}>
            Scan products to plan your shopping, build and share your shopping
            lists to save time and money!
          </Text>
          <TouchableOpacity
            style={{
              ...styles.containerButton,
              width: '30%',
              padding: 10,
              marginTop: 10,
            }}
            onPress={() => this.props.navigation.navigate('Login')}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Montserrat-SemiBold',
                color: '#fff',
              }}
            >
              Register
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ width: '30%', padding: 10, marginTop: 10 }}
            onPress={() => this.props.navigation.navigate('Home')}
          >
            <Text style={{ ...styles.noDataText, width: util.WP(20) }}>
              Cancel...
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      <View style={styles.cameraContainer}>
        {this.state.focusedScreen ? this.cameraView() : null}
      </View>
    );
  }
}
mapStateToProps = (state) => {
  return {
    lumperShown: state.ui.isLoading,
    details: state.barcode.barcodeProductDetails,
    isGuestUser: state.login.isGuestUser,
    country: state.login.country,
    user: state.login.user,
  };
};
mapDispatchToProps = (dispatch) => {
  return {
    getBarcodeProduct: (params) =>
      dispatch(TASKS.barcodeProductDetails(params)),
    resetBarcodeItemDetails: () => dispatch(TASKS.resetBarcodeItemDetails()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Scan);
