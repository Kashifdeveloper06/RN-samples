import { StyleSheet, Dimensions, StatusBar } from 'react-native';
import DeviceInfo from 'react-native-device-info';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
import * as util from './utilities';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  containerDarker: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  containerWhite: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerBlue: {
    flex: 1,
    backgroundColor: '#26ACE1',
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  cameraPreview: {
    flex: 1,
    //justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'red',
  },

  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  appBar: {
    backgroundColor: '#79B45D',
    height: APPBAR_HEIGHT,
  },
  cameraIcon: {
    margin: 5,
    height: 40,
    width: 40,
  },
  cameraBottomOverlay: {
    position: 'absolute',
    width: '100%',
    flex: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#F5FCFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#F5FCFF',
    marginBottom: 5,
  },
  onBoardTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: util.WP('7'),
    backgroundColor: '#fff',
    color: '#00355F',
    width: '90%',
    textAlign: 'center',
    paddingBottom: util.WP('3'),
    marginTop: -40,
  },
  h1Title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: util.HP('2.6'),
    color: '#00355F',
    textAlign: 'left',
    //width:util.WP('90'),
    paddingTop: 12,
  },
  modalTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: util.HP('2.6'),
    color: '#00355F',
    textAlign: 'left',
  },
  modalSubTitle: {
    fontFamily: 'Montserrat-Medium',
    fontSize: util.HP('2.1'),
    color: '#00355F',
  },
  h1TitleWhite: {
    fontFamily: 'Montserrat-Bold',
    fontSize: util.HP('2.6'),
    color: '#fff',
    textAlign: 'left',
    //width:util.WP('90'),
    paddingTop: 12,
  },
  h1SubTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: '#00355F',
    textAlign: 'left',
    width: '90%',
    paddingLeft: 20,
  },
  h1TitleBreak: {
    fontFamily: 'Montserrat-Bold',
    fontSize:
      util.isIphoneX() || util.isIphoneXSM() ? util.HP('2') : util.HP('2.6'),
    color: '#00355F',
    textAlign: 'left',
    width: util.WP('60'),
  },
  h1TitleFix: {
    fontFamily: 'Montserrat-Bold',
    fontSize: util.HP('2.6'),
    color: '#00355F',
    textAlign: 'left',
    width: '100%',
    //height:util.WP('10')
  },
  h2Title: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 20,
    color: '#00355F',
    marginLeft: 18,
  },
  h3Title: {
    fontFamily: 'Montserrat-Medium',
    fontSize: util.HP('2.1'),
    color: '#00355F',
    marginLeft: 18,
  },
  onBoardSubTitle1: {
    fontFamily: 'Montserrat-Regular',
    fontSize: util.WP('4'),
    backgroundColor: '#fff',
    color: '#00355F',
    textAlign: 'center',
    lineHeight: util.WP('5'),
    //paddingBottom:47,
    height: 'auto',
    paddingLeft: 10,
    paddingRight: 10,
    width: '90%',
  },
  onBoardSubTitle2: {
    fontFamily: 'Montserrat-Regular',
    fontSize: util.WP('4'),
    backgroundColor: '#fff',
    color: '#00355F',
    textAlign: 'center',
    lineHeight: util.WP('5.5'),
    //paddingBottom:51,
    height: util.WP('20'),
    paddingLeft: 10,
    paddingRight: 10,
    width: '90%',
  },
  h1ListTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: util.HP('2.8'),
    color: '#FFFFFF',
    textAlign: 'left',
    width: '90%',
  },
  imageContain: {
    backgroundColor: '#fff',
    paddingTop: 20,
    width: '90%',
    height: util.HP('70'),
    marginTop: -1 * util.HP('65'),
  },
  yellowContainerSmall: {
    backgroundColor: '#FCD504',
    //height: 444/1.8,
    height: util.WP('47'),
    overflow: 'hidden',
  },
  orangeContainerSmall: {
    backgroundColor: '#F58220',
    //height: 444/4,
    height: util.WP('5'),
    //overflow:'hidden',
  },
  whiteContainerSmall: {
    backgroundColor: '#fff',
    //height: 444/4,
    height: util.WP('14'),
    //overflow:'hidden',
  },
  orangeContainerLarge: {
    backgroundColor: '#F58220',
    height: util.HP('24'),
    //overflow:'hidden',
  },
  orangeContainerMedium: {
    backgroundColor: '#F58220',
    height: util.WP('20'),
    //overflow:'hidden',
  },
  yellowContainerMedium: {
    backgroundColor: '#FCD504',
    height: util.WP('40'),
  },
  yellowContainerLarge: {
    backgroundColor: '#FCD504',
    height: util.WP('70'),
    //overflow:'hidden',
  },

  yellowContainerLargeLogin: {
    backgroundColor: '#FCD504',
    height: util.WP('56'),
    //overflow:'hidden',
  },
  yellowContainerExtraLarge: {
    backgroundColor: '#FCD504',
    height: util.isIphoneX() ? util.WP('100') : util.WP('93'),

    flex: 1,
    //overflow:'hidden',
  },
  blueContainerSmall: {
    backgroundColor: '#004678',
    height: util.HP('10'),
    //overflow:'hidden',
  },
  lightBlueContainerSmall: {
    backgroundColor: '#26ACE1',
    height: util.WP('18'),
    //overflow:'hidden',
  },
  lightBlueContainerMedium: {
    display: 'flex',
    backgroundColor: '#26ACE1',
    height:
      util.isIphoneX() || util.isIphoneXSM() ? util.WP('14') : util.WP('12'),
    //overflow:'hidden',
  },
  lightBlueContainerLarge: {
    backgroundColor: '#26ACE1',
    height: util.WP('60'),
    //overflow:'hidden',
  },
  notificationView: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingLeft: 15,
    paddingTop: util.WP('3'),
    paddingBottom: util.WP('3'),
    borderBottomWidth: 1,
    borderColor: '#F2F2F2',
  },
  notificationTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: util.WP('5'),
    color: '#00355F',
    textAlign: 'left',
    width: util.WP('70'),
  },
  notificationTitleOld: {
    fontFamily: 'Montserrat-Medium',
    fontSize: util.HP('2.5'),
    color: '#00355F',
    textAlign: 'left',
    width: util.WP('70'),
  },
  notificationDesc: {
    fontFamily: 'Montserrat-Regular',
    fontSize: util.HP('2'),
    color: '#2E2E2E',
    textAlign: 'left',
    paddingBottom: util.WP('3'),
    width: util.WP('60'),
  },
  notificationTime: {
    fontFamily: 'Montserrat-Regular',
    fontSize: util.HP('2'),
    color: '#9D9D9D',
    textAlign: 'left',
    width: util.WP('60'),
  },
  offerDetailWeight: {
    fontFamily: 'Montserrat-Regular',
    fontSize: util.WP('4'),
    color: '#9D9D9D',
    textAlign: 'left',
    width: util.WP('60'),
    paddingBottom: util.WP('5'),
  },
  listView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingLeft: 15,
    paddingBottom: 15,
    paddingTop: 15,
    marginLeft: util.WP('0.4'),
    marginRight: util.WP('0.4'),
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#F2F2F2',
  },
  selectListView: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingLeft: 15,
    paddingBottom: 15,
    paddingTop: 15,
    marginLeft: util.WP('0.4'),
    marginRight: util.WP('0.4'),
  },
  listDetailView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 15,
    paddingBottom: 15,
    paddingTop: 15,
    // marginLeft:util.WP('0.4'),
    // marginRight:util.WP('0.4'),
    borderWidth: 1,
    borderColor: '#F2F2F2',
  },
  listName: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: util.HP('2.5'),
    color: '#00355F',
    textAlign: 'left',
    width: util.WP('70'),
  },
  headerLogo: {
    width: 85,
    height: 22,
    marginTop: 9,
    marginLeft: 16,
  },
  parentHeaderLogo: {
    width: 85,
    height: 22,
    flex: 1,
  },
  subHead: {
    width: 145,
    height: 40,
    resizeMode: 'contain',
    marginLeft: 16,
  },
  logoContainer: {
    marginTop: util.HP('6'),
    backgroundColor: '#fff',
    width: 112,
    height: 40,
    alignSelf: 'center',
  },
  logoContainerNav: {
    backgroundColor: '#fff',
    width: 112,
    height: 40,
    justifyContent: 'center',
  },
  backNavButton: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
  },
  buttonCreate: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 14,
    width: '90%',
  },
  containerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00355F',
    padding: 18,
    width: '100%',
  },
  btnaddToList: {
    fontSize: 10,
    fontFamily: 'Montserrat-SemiBold',
    color: '#00355F',
  },
  addToList: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    width: '100%',
    top: util.HP('1.6'),
    paddingTop: util.HP('1'),
    paddingBottom: util.HP('1'),
  },
  addToListBlue: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00355F',
    width: '100%',
    //top:util.HP('1.6'),
    paddingTop: util.WP('5'),
    paddingBottom: util.WP('5'),
  },
  modalBlueButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00355F',
    width: '100%',
    top: util.WP('4'),
    paddingTop: util.WP('3'),
    paddingBottom: util.WP('3'),
  },
  redeemButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: util.WP('25'),
    paddingTop: util.HP('1'),
    paddingBottom: util.HP('1'),
  },
  requestEmbosedButoon: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FB7300',
    width: util.WP('25'),
    paddingTop: util.HP('1'),
    paddingBottom: util.HP('1'),
  },
  whiteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingLeft: util.WP('3'),
    paddingRight: util.WP('3'),
    paddingTop: util.WP('1'),
    paddingBottom: util.WP('1'),
  },
  newNotificationButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FB7300',
    paddingBottom: util.WP('1'),
    paddingTop: util.WP('1'),
    height: util.WP('6.5'),
    width: util.WP('9'),
  },
  swiperCouponButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: util.WP('80'),
    height: util.WP('10'),
    paddingTop: util.HP('1'),
    paddingBottom: util.HP('1'),
    marginTop: util.WP('3'),
  },
  addToListSingle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    width: 128,
    marginTop: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
  addToListTabs: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    width: '100%',
    marginTop: 12,
    paddingTop: util.HP('1'),
    paddingBottom: util.HP('1'),
  },
  orangeButtonText: {
    color: '#FB7300',
  },
  swiperImage: {
    height: util.isIphoneXSM() ? util.WP('45') : util.WP(50),
    width: '98%',
    resizeMode: 'cover',
  },
  swiperSlide: {
    marginLeft: 9,
    marginTop: 5,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  swiperSlideCoupons: {
    flexDirection: 'column',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    paddingTop: 20,
    //paddingBottom:20,
    //marginBottom:20,
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: util.WP('58'),
  },
  swiperSlideCouponsLast: {
    flexDirection: 'column',
    //marginLeft: util.WP('20'),
    //marginRight: util.WP('20'),
    paddingTop: util.WP('30'),
    //marginBottom:20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerCard: {
    height: util.isIphoneX()
      ? util.WP('60')
      : util.isIphoneXSM()
      ? util.WP('60')
      : util.WP('54'),
    width: util.WP('42'),
    marginRight: 1,
    marginLeft: 0,
    padding: util.WP('4'),
    borderWidth: 0,
    borderColor: '#fff',
  },
  couponCard: {
    height: util.isIphoneX()
      ? util.WP('58')
      : util.isIphoneXSM()
      ? util.WP('58')
      : util.WP('56'),
    width: util.WP('42'),
    marginRight: 1,
    marginLeft: 0,
    padding: util.WP('2'),
    borderWidth: 0,
    borderColor: '#fff',
  },
  couponEligibleCard: {
    height: 248,
    width: 168,
    marginRight: 1,
    marginLeft: 0,
    borderWidth: 0,
    marginBottom: 0,
    marginTop: 0,
    borderColor: '#fff',
  },
  offerCardDual: {
    height:
      util.isIphoneX() || util.isIphoneXSM() ? util.WP('65') : util.WP('60'),
    width: util.WP('47'),
    marginRight: 1,
    marginLeft: 0,
    borderWidth: 0,
    marginBottom: 0,
    marginTop: 0,
    borderColor: '#fff',
  },
  cardImageContainer: {
    textAlign: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cardImage: {
    height: util.HP('12'),
    width: util.HP('12'),
    resizeMode: 'contain',
  },
  cardImageTabs: {
    height: util.HP('12'),
    width: util.HP('12'),
    resizeMode: 'contain',
  },
  currentPrice: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: '#00355F',
    marginRight: 10,
  },
  currentPriceTabs: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: '#00355F',
    marginRight: 10,
  },
  currentPriceOffer: {
    fontFamily: 'Montserrat-Bold',
    fontSize: util.WP('10'),
    color: '#FB7300',
    marginRight: 10,
  },
  oldPriceOffer: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: util.WP('6'),
    color: '#9D9D9D',
    paddingTop: 8,
    textDecorationLine: 'line-through',
  },
  oldPrice: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 10,
    color: '#9D9D9D',
    textDecorationLine: 'line-through',
    paddingTop: 4,
  },
  oldPriceTabs: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    color: '#9D9D9D',
    textDecorationLine: 'line-through',
    paddingTop: 4,
  },
  cardDetail: {
    fontFamily: 'Montserrat-Regular',
    fontSize: util.WP('2.5'),
    color: '#2E2E2E',
    paddingTop: 5,
    height: util.HP('5'),
  },
  cardDetailTabs: {
    fontFamily: 'Montserrat-Regular',
    fontSize: util.HP('1.8'),
    color: '#2E2E2E',
    paddingTop: 5,
    height: util.HP('5.5'),
  },
  cardDetailSingle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: util.HP('1.8'),
    color: '#2E2E2E',
    paddingTop: 5,
    width: util.WP('45'),
  },

  couponModalContainer: {
    backgroundColor: '#fff',
    width: '98%',
    //marginRight:5,
    //marginLeft:5,
    //marginTop:-1*util.WP('30'),
    paddingTop: 30,
  },
  productModalContainer: {
    backgroundColor: '#fff',
    width: '98%',
    //marginRight:5,
    //marginLeft:5,
    //marginTop:-1*util.WP('30'),
    // paddingTop:10
  },
  smallModalContainer: {
    backgroundColor: '#fff',
    width: '98%',
    paddingLeft: util.WP(6),
    paddingRight: util.WP(6),
    paddingTop: util.WP(8),
    paddingBottom: util.WP(8),
  },
  promotionDetailContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: util.WP('5'),
    paddingRight: util.WP('5'),
    paddingTop: util.WP('10'),
  },
  offerDetailContainer: {
    backgroundColor: '#fff',
    width: '95%',
    marginRight: 10,
    marginLeft: 10,
    marginTop: -1 * util.WP('28'),
    paddingTop: 30,
    marginBottom: util.WP('5'),
  },
  offerDetailContainer2: {
    backgroundColor: '#fff',
    width: '95%',
    marginRight: 10,
    marginLeft: 10,
    paddingTop: 30,
    marginBottom: util.WP('5'),
  },
  couponDetailContainer: {
    backgroundColor: '#fff',
    width: '95%',
    marginRight: 10,
    marginLeft: 10,
    marginTop: -1 * util.WP('28'),
    // paddingTop: 30,
  },
  couponTitleContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 20,
    // backgroundColor: '#FCD504',
    width: '100%',
    // height: 50,
    // borderTopRightRadius: 20,
    // borderTopLeftRadius: 20,
    // paddingRight: 20,
  },
  couponSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 23,
    marginLeft: 20,
    marginRight: 30,
  },
  couponSwitchText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#00355F',
  },
  couponTimer: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#FB7300',
    marginTop: 15,
    marginLeft: 20,
  },
  couponTimeLeft: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#9D9D9D',
    marginTop: 3,
    marginLeft: 20,
  },
  couponExpiry: {
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
    color: '#9D9D9D',
    marginTop: 15,
    marginLeft: 20,
  },
  couponBarcodeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 14,
    marginTop: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F2F2F2',
  },
  OfferDetailContainer: {
    //justifyContent:'center',
    //alignItems:'center',
    // paddingTop:14,
    // paddingBottom:14,
    flexDirection: 'column',
    marginTop: 30,
    marginLeft: 20,
    borderBottomWidth: 1,
    borderColor: '#F2F2F2',
  },
  couponSwiper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 20,
    borderTopWidth: 1,
    //borderBottomWidth:1,
    borderColor: '#F2F2F2',
  },
  couponItemDescription: {
    fontSize: util.WP(3.5),
    fontFamily: 'Montserrat-Regular',
    color: '#2D2D2D',
    // backgroundColor:'red',
    marginTop: 15,
    width:'100%',
    // marginLeft: 10,
    // marginRight: 10,
    lineHeight: 27,
  },
  couponEligibleSingle: {
    flexDirection: 'row',
    marginTop: 10,
    marginRight: 10,
    paddingTop: 20,
    backgroundColor: '#fff',
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  modalEligibleSingle: {
    flexDirection: 'row',
    marginRight: 10,
    paddingTop: 10,
    backgroundColor: '#fff',
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  couponEligibleDouble: {
    flexDirection: 'row',
    marginTop: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  couponEligibleData: {
    textAlign: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginLeft: 36,
  },
  scannerText: {
    textAlign: 'left',
    width: 221,
    marginLeft: 10,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#FFFFFF',
  },
  scannerCancelContainer: {
    flexDirection: 'row',
    marginTop: util.HP('6'),
    width: '90%',
    elevation: 1,
    zIndex: 1,
    marginBottom: 20,
  },
  scannerContentContainer: {
    marginTop: util.HP('3'),
    //marginBottom:300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    elevation: 1,
    zIndex: 1,
  },
  viewAll: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: '#FB7300',
    marginRight: 18,
  },
  noDataText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#FB7300',
    marginLeft: 18,
    marginRight: 18,
  },
  roundButtonNotification: {
    backgroundColor: '#fff',
    paddingTop: util.WP(2),
    paddingBottom: util.WP(2),
    paddingRight: util.WP(2),
    paddingLeft: util.WP(2),
    borderRadius: util.WP(7),
    marginRight: 10,
  },
  roundButtonUser: {
    backgroundColor: '#fff',
    paddingTop: util.WP(2),
    paddingBottom: util.WP(2),
    paddingRight: util.WP(2),
    paddingLeft: util.WP(2),
    borderRadius: util.WP(7),
  },
  datePickerInput: {
    backgroundColor: '#fff',
    height: 35,
    width: '100%',
    paddingLeft: 20,
    borderColor: '#F2F2F2',
    borderBottomWidth: 1,
  },
  textInputDatePicker: {
    backgroundColor: '#fff',
    height: 35,
    width: '100%',
    paddingLeft: 20,
    borderColor: '#F2F2F2',
    borderBottomWidth: 1,
  },
  textInput: {
    backgroundColor: '#fff',
    height: DeviceInfo.isTablet() ? util.HP(4)  :util.WP(10),
    width: '100%',
    paddingLeft: 20,
    // fontSize: Platform.OS == 'ios' ? 16 : 14,
    fontSize: DeviceInfo.isTablet() ? util.WP(2.8) : util.WP(3.5),
    borderColor: '#F2F2F2',
    borderBottomWidth: 1,
    fontFamily: 'Montserrat-Light',
  },
  labelInput: {
    backgroundColor: '#fff',
    paddingLeft: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: Platform.OS === 'android' ? 0 : 0,

    height: DeviceInfo.isTablet() ? util.HP(1.5) : util.WP(5),
    // marginTop:1
  },
  labelTextInput: {
    fontSize: DeviceInfo.isTablet() ? util.WP(1.5) : util.WP(2.5),
    fontFamily: 'Montserrat-SemiBold',
    color: '#828282',
  },
  errorTextInput: {
    marginRight: 10,
    fontSize: util.WP(2.5),
    fontFamily: 'Montserrat-Regular',
    color: 'red',
  },
  modalTextInput: {
    backgroundColor: '#fff',
    height: util.WP('10'),
    width: '100%',
    paddingLeft: 20,
    fontSize: 14,
    borderColor: '#F2F2F2',
    marginBottom: util.WP(3),
    marginTop: util.WP(3),
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  modalTextInputNoBorders: {
    backgroundColor: '#fff',
    height: util.WP('10'),
    width: '100%',
    paddingLeft: 20,
    fontSize: 14,
    //borderColor: '#F2F2F2',
    //marginBottom:util.WP(3),
    //marginTop:util.WP(3),
    //borderBottomWidth: 1,
    //borderTopWidth:1,
  },
  dateInput: {
    width: 0,
    height: 0,
    opacity: 0,
  },
  placeHolderInputs: {
    color: '#828282',
  },
  footerLogo: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    // marginTop: SCREEN_HEIGHT*0.07,
    // marginTop: 50,
  },
  modalClose: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: util.WP('7'),
  },
  profilePicture: {
    height: util.WP('25'),
    width: util.WP('25'),
    borderRadius: util.WP('25') / 2,
    borderColor: '#fff',
    borderWidth: util.WP(1),
  },
  profilePageIcon: {
    height: util.WP('5'),
    width: util.WP('5'),
    marginRight: util.WP('2'),
  },
  profileDataContainer: {
    flexDirection: 'column',
    marginLeft: util.WP('2.5'),
    width: util.WP(95),
    marginTop: util.WP('6'),
  },
  profileDataItem: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#F2F2F2',
    flexDirection: 'row',
    height: util.WP('16'),
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: util.WP('3'),
    paddingBottom: util.WP('3'),
    paddingLeft: util.WP('6'),
    paddingRight: util.WP('6'),
  },
  purchaseHistoryContainer: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#F2F2F2',
    height: util.WP('23'),
    paddingTop: util.WP('3'),
    paddingBottom: util.WP('3'),
    paddingLeft: util.WP('4'),
    paddingRight: util.WP('4'),
  },
  purchaseDetailContainer: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#F2F2F2',
    //height:util.WP('20'),
    paddingTop: util.WP('3.5'),
    paddingBottom: util.WP('3.5'),
    paddingLeft: util.WP('5'),
    paddingRight: util.WP('5'),
  },
  flatListStyle1: {
    marginLeft: util.WP(3),
    marginRight: util.WP(3),
    marginBottom: util.WP(3),
    marginTop: util.WP(3),
    backgroundColor: '#fff',
  },
  unreadEmptyStyle: {
    marginLeft: util.WP(3),
    marginRight: util.WP(3),
    marginBottom: util.WP(3),
    marginTop: util.WP(3),
    height: util.WP(20),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nopes: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#000',
  },
  nothing: {
    fontWeight: 'bold',
    fontSize: util.WP('5'),
    color: '#fff',
  },
  loader: {
    // display: 'flex',
    // flex:6,
    height: util.WP(150),

    justifyContent: 'flex-start',
    alignItems: 'center',
    top: 75,
  },
  searchItem: {
    borderColor: '#fff',
    borderWidth: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: util.WP(15),
    margin: util.WP(0.5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  searchItemHighlight: {
    borderColor: '#FB7300',
    borderWidth: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: util.WP(15),
    margin: util.WP(0.5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  searchItemText: {
    fontSize: util.WP('3.5'),
    fontFamily: 'Montserrat-SemiBold',
    color: '#00355F',
  },
  searchItemTextHighlight: {
    fontSize: util.WP('3.5'),
    fontFamily: 'Montserrat-SemiBold',
    color: '#FB7300',
  },
  headerIcons: {
    width: util.WP(10.8),
    height: util.WP(10.8),
    backgroundColor: '#fff',
    marginRight: 10,
    borderRadius: util.WP(10.8) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  PickerStyles: {
    backgroundColor: '#fff',
    height: 38,
    width: '100%',
    paddingLeft: 20,
    fontSize: Platform.OS == 'ios' ? 16 : 14,
    borderColor: '#F2F2F2',
    borderWidth: 1,
    fontFamily: 'Montserrat-Regular',
  },

  hairLine: {
    borderBottomColor: "#00355F", 
    borderBottomWidth: StyleSheet.hairlineWidth, 
    alignSelf:'stretch',
    width: "100%"
  }
});
