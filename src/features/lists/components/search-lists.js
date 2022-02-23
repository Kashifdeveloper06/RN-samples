import React, { Component } from 'react';
import {
  Image,
  Dimensions,
  AsyncStorage,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
} from 'react-native';
import { styles } from '../../../styles';
import { Card } from 'react-native-elements';
import * as util from '../../../utilities';
import { Text, View, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import * as TASKS from '../../../store/actions';
import Modal from 'react-native-modal';
import analytics from '@react-native-firebase/analytics';
import DeviceInfo from 'react-native-device-info';
import ProductStockInfoModal from '../../shared/product/StockInfo';

class SearchLists extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <Image
        style={styles.parentHeaderLogo}
        resizeMode="contain"
        source={require('../../../../assets/Logo.png')}
      />
    ),
    headerStyle: {
      borderBottomWidth: 0,
    },
    headerLeft: null,
  });
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      refresh: true,
      checkedList: [],
      searching: false,
      isMounted: false,
      stockInfo: { outOfStock: true, lowInStock: [], inStock: [] },
      outOfStock: true,
      lowInStock: [],
      inStock: [],
      stockInfoModalIsVisible: false,
      processingStockInfo: false,
      list_id: this.props.navigation.state.params.list_id,
      list_name: this.props.navigation.state.params.list_name,
    };
    var params = {
      list_id: this.state.list_id,
      term: '',
      country_code: this.props.country,
    };
    this.props.searchListItems(params);

    this.screenanalytics()
  }

  async screenanalytics() {
    await analytics().setCurrentScreen('ProductSearchScreen', 'ProductSearchScreen');
  }

  componentDidMount() {
    console.log('search resultys', this.props.searchItems);
    this.setState({ isMounted: true });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.productStockInfo &&
      JSON.stringify(prevProps.productStockInfo) !==
        JSON.stringify(this.props.productStockInfo)
    ) {
      this.setState({ processingStockInfo: true });
      let _lowInStock = [];
      let _inStock = [];
      this.props.productStockInfo.stockInfo.map((item, index) => {
        if (parseInt(item.quantity) > 10 && parseInt(item.quantity) < 50) {
          _lowInStock.push(item);
        } else if (parseInt(item.quantity) > 50) {
          _inStock.push(item);
        }
      });

      if (_lowInStock.length || _inStock.length) {
        this.setState({
          stockInfo: {
            outOfStock: false,
            lowInStock: _lowInStock,
            inStock: _inStock,
          },
        });
      }

      setTimeout(() => {
        this.setState({ processingStockInfo: false });
      }, 1000);
    }

    if ( this.state.searchTerm && this.state.searchTerm !== prevState.searchTerm && this.state.searchTerm.length < 3 ) {
      this.props.clearSearchItems(null);
    }
  }
  handleTap(product_id) {
    //alert(product_id);return false;
    this.setState({ stockInfoModalIsVisible: false });
    this.setState({
      outOfStock: true,
      lowInStock: [],
      inStock: [],
    });
    var check = this.state.checkedList.indexOf(product_id);
    if (check != -1) {
      this.state.checkedList.splice(check, 1);
    } else {
      this.state.checkedList.push(product_id);
    }
    this.setState({
      refresh: !this.state.refresh,
    });
  }
  handleLongPress(product) {
    // this.setState({
    //   outOfStock: true,
    //   lowInStock: [],
    //   inStock: [],
    // });
    // this.setState({ stockInfoModalIsVisible: true });
    // this.props.getProductStockInfo(product_id);
    this.setState({
      productID:product.id,
      stockInfoModalIsVisible:true,
      stockProduct:product
    })
  }
  closeStockModal = (isVisible) => {
    this.setState({stockInfoModalIsVisible: !this.state.stockInfoModalIsVisible})
  }
  openproductOverlay = () => {
    // this.setState({overlayId:this.state.productID})
    this.handleTap(this.state.productID)
    this.setState({stockInfoModalIsVisible: !this.state.stockInfoModalIsVisible})
  }
  modalProductStockInfoToggler = () => {
    this.setState({
      stockInfoModalIsVisible: !this.state.stockInfoModalIsVisible,
    });
    this.setState({
      outOfStock: true,
      lowInStock: [],
      inStock: [],
    });
  };
  modalProductStockInfo() {
    return (
      <Modal isVisible={this.state.stockInfoModalIsVisible}>
        <ScrollView>
          <View style={styles.modalClose}>
            <TouchableOpacity
              onPress={() => {
                this.modalProductStockInfoToggler();
              }}
            >
              <Image
                style={{ height: util.WP(10), width: util.WP(10) }}
                source={require('../../../../assets/close-round.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.productModalContainer}>
            <View
              style={{
                textAlign: 'centre',
                width: '100%',
                height: util.WP(15),
                paddingTop: 20,
                paddingLeft: 5,
                borderBottomWidth: 1,
                borderBottomColor: '#828282',
              }}
            >
              <Text style={styles.modalTitle}>Product Stock Details</Text>
            </View>
            {this.props.productStockInfo != null ? (
              <View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Image
                      style={{
                        width: util.WP(40),
                        height: util.WP(50),
                        resizeMode: 'contain',
                      }}
                      source={
                        this.props.productStockInfo.images.length > 0
                          ? { uri: this.props.productStockInfo.images[0] }
                          : require('../../../../assets/no-image.png')
                      }
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <View style={{}}>
                      <Text
                        style={{
                          fontSize: util.HP('5'),
                          fontFamily: 'Montserrat-Bold',
                          color: '#FB7300',
                          textAlign: 'left',
                        }}
                      >
                        ${this.props.productStockInfo.unit_retail}
                      </Text>
                    </View>
                    <View style={{}}>
                      <Text
                        style={{
                          fontSize: util.HP('2.5'),
                          fontFamily: 'Montserrat-regular',
                          color: '#00355F',
                          textAlign: 'left',
                        }}
                      >
                        {this.props.productStockInfo.desc}
                      </Text>
                    </View>
                    <View style={{}}>
                      <Text
                        style={{
                          fontSize: util.HP('1.5'),
                          fontFamily: 'Montserrat-Bold',
                          color: '#828282',
                          textAlign: 'left',
                        }}
                      >
                        {this.props.productStockInfo.size}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    width: '100%',
                    height: util.WP(15),
                    paddingTop: 20,
                    paddingLeft: 2,
                    borderBottomWidth: 1,
                    borderBottomColor: '#828282',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: 14,
                      color: '#00355F',
                    }}
                  >
                    Stock
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: 14,
                      color: '#FB7300',
                      marginLeft: 2,
                    }}
                  >
                    (As of Today 6:00 AM)
                  </Text>
                </View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ height: util.WP('50'), width: '95%' }}
                  contentContainerStyle={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {!this.state.processingStockInfo ? (
                    !this.state.stockInfo.outOfStock ? (
                      <View>
                        <FlatList
                          style={{
                            marginLeft: 10,
                            marginRight: 10,
                            marginBottom: 10,
                          }}
                          data={this.state.stockInfo.inStock}
                          extraData={this.state.refresh}
                          numColumns={1}
                          renderItem={({ item: stockInfo }) => {
                            return (
                              <View
                                style={{
                                  width: '100%',
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  marginTop: 1,
                                }}
                              >
                                <View style={{ width: '70%' }}>
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      alignSelf: 'flex-start',
                                      marginLeft: 5,
                                      marginTop: 5,
                                    }}
                                  >
                                    {stockInfo.location}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    backgroundColor: '#FB7300',
                                    alignItems: 'center',
                                    width: '30%',
                                    borderRadius: 10,
                                  }}
                                >
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      fontFamily: 'Montserrat-SemiBold',
                                      color: '#fff',
                                    }}
                                  >
                                    In Stock
                                  </Text>
                                </View>
                              </View>
                            );
                          }}
                          keyExtractor={(item, index) => index.toString()}
                        />
                        <FlatList
                          style={{
                            marginLeft: 10,
                            marginRight: 10,
                            marginBottom: 20,
                          }}
                          data={this.state.stockInfo.lowInStock}
                          extraData={this.state.refresh}
                          numColumns={1}
                          renderItem={({ item: stockInfo }) => {
                            return (
                              <View
                                style={{
                                  width: '100%',
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  marginTop: 1,
                                }}
                              >
                                <View style={{ width: '65%' }}>
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      alignSelf: 'flex-start',
                                      marginLeft: 5,
                                      marginTop: 5,
                                    }}
                                  >
                                    {stockInfo.location}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    backgroundColor: '#FCD504',
                                    alignItems: 'center',
                                    width: '35%',
                                    borderRadius: 10,
                                  }}
                                >
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      fontFamily: 'Montserrat-SemiBold',
                                      color: 'black',
                                    }}
                                  >
                                    Low in Stock
                                  </Text>
                                </View>
                              </View>
                            );
                          }}
                          keyExtractor={(item, index) => index.toString()}
                        />
                      </View>
                    ) : (
                      <View
                        style={{
                          height: '100%',
                          flex: 1,
                          top: 50,
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={styles.noDataText}>
                          This Product is Out of Stock
                        </Text>
                      </View>
                    )
                  ) : (
                    <View
                      style={{
                        height: '100%',
                        flex: 1,
                        top: 50,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={styles.noDataText}>Loading...</Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            ) : (
              <View
                style={{
                  height: util.WP('90'),
                  width: util.WP(94),
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    fontSize: util.HP('2.6'),
                    color: '#00355F',
                  }}
                >
                  Loading...
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        <View>
          {this.props.productStockInfo && 
            <TouchableOpacity
                  onPress={() => this.handleTap(this.props.productStockInfo.id)}
                  style={styles.addToListBlue}
                >
                  <Text
                    style={{
                      fontSize: util.WP('5'),
                      fontFamily: 'Montserrat-SemiBold',
                      color: '#fff',
                    }}
                  >
                    Select
                  </Text>
                </TouchableOpacity>
          }
        </View>
      </Modal>
    );
  }

  triggerSearch = () => {
    // this.setState({ searchTerm: text });
    let text = this.state.searchTerm
    if (text.length > 2) {      
      //this.props.clearSearchItems(null);
      this.state.checkedList = [];
      var params = {
        list_id: this.state.list_id,
        term: text,
        country_code: this.props.user.user_info.country
      };

      this.props.searchListItems(params);
      analytics().logEvent('searchTerms', {
            term: text,
          })
      // console.log('call search', _callSearch);
      setTimeout(() => {
        this.setState({ refresh: !this.state.refresh });
      }, 1000);
    } else {
      this.props.clearSearchItems(null);
    }
  };
  addToListAll() {
    if (this.state.checkedList.length > 0) {
      this.state.checkedList.map((element, index) => {
        var addParams = {
          list_id: this.state.list_id,
          product_id: element,
        };
        this.props.addListItem(addParams);
      });
      setTimeout(() => {
        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack();
        util.showToast('Items Added Successfully');
      }, 3000);
    } else {
      util.showToast('Please Select Items to Add');
    }
  }
  render() {
    const { isMounted } = this.state;
    return isMounted ? (
      <View style={styles.container}>
        {/*this.modalProductStockInfo()*/}
        {this.state.stockInfoModalIsVisible && <ProductStockInfoModal
         isVisible={this.state.stockInfoModalIsVisible} 
         product={this.state.stockProduct}
         closeModal={this.closeStockModal}
         selectToAdd={this.openproductOverlay} 
        />}
        <View style={styles.whiteContainerSmall} />
        <View
          style={{
            flex:1,
            width: util.WP(97),
            height: '100%',
            marginLeft: util.WP(1.5),
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              top: -util.WP(8),
              height: util.WP(14),
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 5,
            }}
          >
            <View
              style={{
                backgroundColor: '#fff',
                flexDirection: 'row',
                alignItems: 'center',
                width: util.WP(58),
                paddingLeft: util.WP(2),
                marginRight: util.WP(0.5),
              }}
            >
              <TouchableOpacity
              onPress={()=>this.triggerSearch()}
              >
                <Image
                  style={{
                    height: util.WP(4),
                    width: util.WP(4),
                    marginRight: util.WP('2'),
                  }}
                  resizeMode="contain"
                  source={require('../../../../assets/search-blue.png')}
                />
              </TouchableOpacity>
              <TextInput
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  color: '#00355F',
                  fontSize: util.WP(4),
                  width: '90%',
                  height: '100%',
                }}
                placeholder={'Search'}
                placeholderTextColor="#00355F"
                value={this.state.searchTerm}
                onChangeText={(text) => this.setState({ searchTerm: text })}
                returnKeyType={'search'}
                autoFocus={true}
                onSubmitEditing={text => this.triggerSearch()}
              />
            </View>
            <TouchableOpacity
              onPress={()=>this.triggerSearch()}
              style={{...styles.whiteButton,marginRight: util.WP(0.5)}}
              >
               <Text
                style={{
                  fontSize: util.WP('4'),
                  fontFamily: 'Montserrat-SemiBold',
                  color: '#00355F',
                }}
              >
                Search
              </Text>   
              </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={styles.whiteButton}
            >
              <Text
                style={{
                  fontSize: util.WP('4'),
                  fontFamily: 'Montserrat-SemiBold',
                  color: '#00355F',
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
         
            {this.props.lumperShown ? (
              <View style={{ top: -util.WP(20), height: util.WP(90) }}>
                {util.Lumper({ lumper: false })}
              </View>
            ) : this.props.searchItems && this.state.searchTerm.length > 2 ? (
              this.props.searchItems.length ? (
                 <View>
                 <View style={{
                    width:'100%',
                    // marginBottom:2,
                    top: -util.WP(4.5),
                    height: util.WP(10),
                    backgroundColor:'#F58220',
                    justifyContent:'center',
                    alignItems:"center"
                  }}>
                    <Text
                      style={{
                        fontSize: util.WP(3),
                        fontFamily: 'Montserrat-Bold',
                        color: '#fff',
                      }}
                    >
                      Press & Hold Items for More Info.
                    </Text>
                  </View>
                <ScrollView
                  style={{
                    // marginBottom: 2,
                    // height:util.WP(100)
                    maxHeight:
                      DeviceInfo.isTablet() ? util.HP(53)
                      : util.isIphoneX() || util.isIphoneXSM()
                        ? util.WP('125')
                        : util.WP('100'),
                    // width: util.WP(96),
                  }}
                  contentContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <FlatList
                    style={{
                      // marginLeft: 10,
                      // marginRight: 10,
                      marginBottom: 1,
                    }}
                    showsVerticalScrollIndicator={false}
                    data={this.props.searchItems}
                    extraData={this.state.refresh}
                    numColumns={1}
                    renderItem={({ item: rowData }) => {
                      if (rowData.is_present == 1) {
                        this.state.checkedList.push(rowData.id);
                      }
                      return (
                        <View
                          style={
                            this.state.checkedList.indexOf(rowData.id) == -1
                              ? styles.searchItem
                              : styles.searchItemHighlight
                          }
                        >
                          <TouchableOpacity
                            onPress={() => this.handleTap(rowData.id)}
                            onLongPress={() => this.handleLongPress(rowData)}
                            style={[
                              styles.whiteButton,
                              {
                                width: '100%',
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                              },
                            ]}
                          >
                            <View style={{ width: '80%' }}>
                              <Text
                                numberOfLines={2}
                                style={
                                  this.state.checkedList.indexOf(rowData.id) ==
                                  -1
                                    ? styles.searchItemText
                                    : styles.searchItemTextHighlight
                                }
                              >
                                {rowData.name}
                              </Text>
                              <Text
                                style={{
                                  fontFamily: 'Montserrat-SemiBold',
                                  color: 'grey',
                                  fontSize: util.WP(2.5),
                                }}
                              >
                                {rowData.size}
                              </Text>
                            </View>
                            <View
                              style={{ width: '20%', alignItems: 'flex-end' }}
                            >
                              <Text
                                style={{
                                  fontSize: 14,
                                  fontFamily: 'Montserrat-SemiBold',
                                  color: '#FF7600',
                                }}
                              >
                                ${rowData.unit_retail}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </ScrollView>
                </View>
              ) : (
                // renders when no search results found
                <View
                  style={{
                    height:
                      util.isIphoneX() || util.isIphoneXSM()
                        ? util.WP('117')
                        : util.WP('90'),
                    width: util.WP(94),
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: util.HP('2.6'),
                      color: '#00355F',
                    }}
                  >
                    No Products To Show
                  </Text>
                </View>
              )
            ) : (
              // renders when nothing searched (initial entry page)
              <View
                style={{
                  height:
                    util.isIphoneX() || util.isIphoneXSM()
                      ? util.WP('117')
                      : util.WP(55),
                  width: util.WP(94),
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    fontSize: util.HP('2.6'),
                    color: '#00355F',
                  }}
                >
                  No Products To Show
                </Text>
              </View>
            )}

            <View style={{ marginBottom: 18 }}>
              <TouchableOpacity
                onPress={() => this.addToListAll()}
                style={styles.addToListBlue}
              >
                <Text
                  style={{
                    fontSize: util.WP('5'),
                    fontFamily: 'Montserrat-SemiBold',
                    color: '#fff',
                  }}
                >
                  Add To List
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    ) : (
      <View>
        <Text>Loading....</Text>
      </View>
    );
  }
}
mapStateToProps = (state) => {
  return {
    lumperShown: state.ui.isLoading,
    searchItems: state.Lists.searchItems,
    country: state.login.country,
    user: state.login.user,
    productStockInfo: state.Lists.productStockInfo,
  };
};
mapDispatchToProps = (dispatch) => {
  return {
    searchListItems: (params) => dispatch(TASKS.searchListItems(params)),
    getProductStockInfo: (productId) =>
      dispatch(TASKS.getProductStockInfo(productId)),
    clearSearchItems: (params) => dispatch(TASKS.clearSearchItems(params)),
    fetchListItems: (listItemParams) =>
      dispatch(TASKS.fetchListItems(listItemParams)),
    addListItem: (addItemParams) => dispatch(TASKS.addListItem(addItemParams)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchLists);
