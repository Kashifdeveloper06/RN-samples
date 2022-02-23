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
  Text, View, StatusBar
} from 'react-native';
import { styles } from '../../../styles';
import { Card } from 'react-native-elements';
import * as util from '../../../utilities';
import { connect } from 'react-redux';
import * as TASKS from '../../../store/actions';
import Modal from 'react-native-modal';
import analytics from '@react-native-firebase/analytics';
import DeviceInfo from 'react-native-device-info';

class ProductStockInfoModal extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			stockInfo: { outOfStock: true, lowInStock: [], inStock: [] },
		    outOfStock: true,
		    lowInStock: [],
		    inStock: [],
		    stockInfoModalIsVisible: false,
		    processingStockInfo: false,
		}


	}
	componentDidMount(){
    console.log('product', this.props.product)
		this.props.getProductStockInfo(this.props.product.id);
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

  	}

	render(){
		return (
      <Modal isVisible={this.props.isVisible}>
        <ScrollView>
          <View style={styles.modalClose}>
            <TouchableOpacity
              onPress={() =>  this.props.closeModal()}
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
              <Text style={styles.modalTitle}>Product Details</Text>
            </View>
              
              <View style={{ flex: 1}}>
                
                <View style={{ flexDirection: 'row', paddingHorizontal:util.WP(5)}}>
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center', marginRight:util.WP(2) }}
                  >
                    <Image
                      style={{
                        width: util.WP(25),
                        height: util.WP(35),
                        resizeMode: 'contain',
                      }}
                      source={
                        this.props.product.images.length > 0
                          ? { uri: this.props.product.images[0] }
                          : require('../../../../assets/noimage2.png')
                      }
                    />
                  </View>
                  <View
                    style={{
                      justifyContent: 'flex-start',
                      paddingTop:util.WP(5),
                      marginLeft:2,
                      width:'70%'
                    }}
                  >
                    <View style={{}}>
                      <Text
                        style={{
                          fontSize: util.WP('6'),
                          fontFamily: 'Montserrat-Bold',
                          color: '#FB7300',
                          textAlign: 'left',
                        }}
                      >
                        ${this.props.product.unit_retail}
                      </Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Text
                        style={{
                          fontSize: util.WP('4'),
                          fontFamily: 'Montserrat-regular',
                          color: '#00355F',
                          flex:1,
                          flexWrap:'wrap'
                        }}
                      >
                        {this.props.product.name}
                      </Text>
                    </View>
                    <View style={{}}>
                      <Text
                        style={{
                          fontSize: util.WP('2.5'),
                          fontFamily: 'Montserrat-Bold',
                          color: '#828282',
                          textAlign: 'left',
                        }}
                      >
                       {this.props.product.is_scalable ? <Text style={{fontFamily:'Montserrat-Bold',fontSize:util.WP(2.5), color:'#fc7401'}} >Per </Text>:null} {this.props.product.size}
                      </Text>
                    </View>
                  </View>

                </View>
              {/*
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    width: '100%',
                    height: util.WP(15),
                    paddingTop: 5,
                    paddingLeft: 2,
                    borderBottomWidth: 1,
                    borderBottomColor: '#828282',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: util.WP(3),
                      color: '#00355F',
                    }}
                  >
                    Stock
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: util.WP(3),
                      color: '#FB7300',
                      marginLeft: 2,
                    }}
                  >
                    (As of Today 6:00 AM)
                  </Text>
                </View>
  
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ height: util.WP(65), width: '95%' }}
                  contentContainerStyle={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {!this.state.processingStockInfo && this.props.productStockInfo != null ? (
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
                  )
                  }
                </ScrollView>
                */}
              </View>
            
        <View>

            <TouchableOpacity
                  onPress={() => this.props.selectToAdd()}
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
        </View>
          </View>
        </ScrollView>
      </Modal>
    );
	}
}

mapStateToProps = (state) => {
  return {
    lumperShown: state.ui.isLoading,
    productStockInfo: state.Lists.productStockInfo,
  };
};
mapDispatchToProps = (dispatch) => {
  return {
    getProductStockInfo: (productId) => dispatch(TASKS.getProductStockInfo(productId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductStockInfoModal);