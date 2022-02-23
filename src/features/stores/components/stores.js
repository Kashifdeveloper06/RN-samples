import React, { Component } from 'react';
import { Image ,Keyboard,Dimensions,AsyncStorage,ScrollView,TouchableOpacity,FlatList,TextInput,Platform,Linking, Alert} from 'react-native';
import { styles } from '../../../styles';
import { Card } from "react-native-elements";
import * as util from '../../../utilities';
import {Text,View,StatusBar} from 'react-native';
import RNLocation from 'react-native-location';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as geolib from 'geolib';
import { connect } from 'react-redux';
import * as TASKS from '../../../store/actions';
import {NavigationApps,actions,googleMapsTravelModes} from "react-native-navigation-apps";
import analytics from '@react-native-firebase/analytics';

class StoresMap extends React.Component {
  map = null;
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
         <Image style={styles.parentHeaderLogo} resizeMode="contain" source={require('../../../../assets/Logo.png')} />
     ),
     headerLeft: null
    });
  constructor(props) {
        super(props);
        this.state = {
          stores:this.props.clientStores,
          daysCharacters:['sunday','monday','tuesday','wednesday','thursday','friday','saturday'],
          dayNumeric:new Date().getDay(),
          selectedStore:[],
          searchResults:[],
          searchTerm:'',
          isMounted:false,
          refresh:true,
          iconWaze: require('../../../../assets/icons-waze.png'),
          lat:"",
          long:"",
          region: {
            latitude: -37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.1122,
            longitudeDelta: 0.0621,
          },
          destination:null,
          ready: true,

        }
        this.screenanalytics();
    }
    async screenanalytics() {
    await analytics().logScreenView({screen_name:'MapScreen'});
  }
    componentDidMount(){
      console.log('stores', this.state.stores)
      this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
          RNLocation.getCurrentPermission()
            .then(currentPermission => {
               if (currentPermission != 'denied') {
                    util.getLocation((success,failure) => {
                        this.setState({lat: success.coords.latitude});
                        this.setState({long: success.coords.longitude});
                        this.setState({
                          region :{
                            latitude: success.coords.latitude,
                            longitude: success.coords.longitude,
                            latitudeDelta: 0.040,
                            longitudeDelta: 0.040
                          }
                        });
                        this._map.animateToRegion(this.state.region, 1);      

                      }, (error) => {
                          util.enableLocation()
                    })

                }
                else {
                  Alert.alert(
                    'Please Enable Location',
                    'client Stores uses current location to display top offers, digitial coupons and stores near your area',
                    [
                      {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {text: 'Go to Settings', onPress: () => Linking.openURL('app-settings://notification/clientStores')},
                    ],
                    {cancelable: false},
                  );
                }
    
          })
      })
      this.setState({isMounted:true})   
    }
    componentWillUnmount() {
      this.willFocusListener.remove();
    }

  onMapReady = (e) => {
    if(!this.state.ready) {
      this.setState({ready: true});
    }
  };
  
  triggerSearch(text){
    this.setState({isSearching:true})
    this.setState({searchTerm:text})
    
    let _searchResults = [];
    if (text != '') {
      let _country_code = this.props.user ? this.props.user.user_info.country : 'TT'
        this.state.stores.map((element, index) => {
          // this.props.defaultCountries.map((country) => {
          //   if (country.id == element.country_id) {
              if (element.name.toLowerCase().indexOf(text.toLowerCase())>=0 || element.address_line_one.toLowerCase().indexOf(text.toLowerCase())>=0) {
                // if(element.country_code){
                  // if (country.country_code == _country_code) {
                    _searchResults.push(element)  
                  // }
              }
          //   }
          // })
        })
        this.setState({searchResults:_searchResults})
    } else{
      this.setState({isSearching:false})
      this.setState({searchResults:[]})
    }

    this.setState({refresh:!this.state.refresh})
  }

  pushSelectedStore(store){
    this.setState({isSearching:false})
    this.state.selectedStore = [];
    this.state.searchResults = [];
    this.setState({refresh:!this.state.refresh})
    this.state.selectedStore.push(store)
    this._map.animateCamera(
      {
        center: {
          latitude: parseFloat(store.lat),
          longitude: parseFloat(store.lon),
        },
        pitch: 2,
        heading: 20,
        altitude: 100,
        zoom: 18,
      },
      {duration: 1500},
    )
    Keyboard.dismiss();
  }
  setDestination(){
    let _destination = this.state.selectedStore[0];
    this.setState({
      destination: {latitude:this.state.selectedStore[0].lat, longitude:this.state.selectedStore[0].lon}
   });
   this.state.selectedStore = [];
   
  }
  renderTimeFormat(time) {
    if (time != null) {
      let H = time.substr(0, 2);
      let M = time.substr(3,4);
      let h = H % 12 || 12;
      let ampm = H < 12 || H === 24 ? 'am' : 'pm';
      if (M !== '00') {
        h = h+":"+M 
      }
      return h + ampm;
    }
  }
  renderDirectionBlock(){
    let _destination = this.state.selectedStore[0].name+', '+this.state.selectedStore[0].address_line_one
    return(
      <View style={{display:'flex',backgroundColor:'#fff',marginTop:util.HP(40),width:util.WP(94),marginLeft:util.WP(3),paddingRight:util.WP(3),paddingLeft:util.WP(3),paddingBottom:util.WP(8),paddingTop:util.WP(4),position:'absolute',top:-util.WP(7.5)}}>
          <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
            <View style={{display:'flex',flexDirection:'column'}}>
              <Text style={styles.modalTitle}>
              { ((this.state.selectedStore[0].name).length > 20) ? 
                (((this.state.selectedStore[0].name).substring(0,20)) + '...') : 
                this.state.selectedStore[0].name }
              {/* {this.state.selectedStore[0].name} */}
              </Text>
              <Text style={styles.modalSubTitle}>
              { ((this.state.selectedStore[0].address_line_one).length > 20) ? 
                (((this.state.selectedStore[0].address_line_one).substring(0,20)) + '...') : 
                this.state.selectedStore[0].address_line_one }
              </Text>
              <Text style={styles.modalSubTitle}>
              { this.state.selectedStore[0].store_info.phone_number ? 
                this.state.selectedStore[0].store_info.phone_number : 
                null }
              </Text>
              {(this.state.selectedStore[0].store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_to`]
              &&this.state.selectedStore[0].store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_from`])?
              <Text style={{fontFamily: "Montserrat-SemiBold",fontSize: util.WP('4'),color:'#FF7600',marginTop:util.WP(1)}}>
                {(
                new Date().getHours()<parseInt(this.state.selectedStore[0].store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_to`].substring(0, 2))
                && new Date().getHours()>parseInt(this.state.selectedStore[0].store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_from`].substring(0, 2))
                )?
                  "Open Now"
                :
                  "Closed"
                }
              </Text>
              :
              null
              }
              
              <Text style={{fontFamily: "Montserrat-Regular",fontSize: util.WP('4'),color:'#9D9D9D',marginTop:util.WP(1)}}>
                Working hours: {this.state.selectedStore[0].store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_from`]?this.renderTimeFormat(this.state.selectedStore[0].store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_from`]):'N/A'} - {this.state.selectedStore[0].store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_to`]?this.renderTimeFormat(this.state.selectedStore[0].store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_to`]):'N/A'}
              </Text>
            </View>
            <View style={{display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
              <View>
                <Text style={{fontFamily: "Montserrat-Regular",fontSize: util.WP('4'),color:'#9D9D9D',marginTop:util.WP(1)}}>
                  {(geolib.getDistance(this.state.region,{latitude:this.state.selectedStore[0].lat,longitude:this.state.selectedStore[0].lon})/1000).toFixed(2)}km
                </Text>
              </View>
              
            </View>  
          </View>
          <View style={{flexDirection:'row'}}>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',width:'50%'}}>
              <View
                // onPress={()=>this.setDestination()}
                style={{...styles.addToList, top:util.WP(1.8)}}
              >  
              <Text style={{fontSize: util.WP('4'),fontFamily:'Montserrat-SemiBold',color:'#00355F'}}>Get Directions</Text>
            </View>
          <View style={{ position:'absolute',top:util.WP(6),right: -5 }}>
          <View style={{ borderBottomWidth: 1, borderLeftWidth: 1 ,backgroundColor: '#FFD700', borderColor: '#FFD700', width: util.WP(5), height: util.WP(5), transform: [{ rotate: '45deg'}] }}>

            </View>
          </View>
          </View>
            <View style={{width:'50%', marginTop:util.WP(1.8)}}>
                <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                  <TouchableOpacity style={{marginTop:8}} onPress={()=>this.openWaze(this.state.selectedStore[0].lat,this.state.selectedStore[0].lon,_destination)}>
                    <Image style={{width:35, height:38}} source={require('../../../../assets/icon-waze-240.png')} />
                  </TouchableOpacity>

                  <TouchableOpacity style={{marginTop:8}} onPress={()=>this.opengoogleMaps(this.state.selectedStore[0].lat,this.state.selectedStore[0].lon,_destination.replace(" ","+"))}>
                    <Image style={{width:35, height:38}} source={require('../../../../assets/icons-rmaps-240.png')} />
                  </TouchableOpacity>

                  {Platform.OS === 'ios' ?
                    <TouchableOpacity style={{marginTop:8}} onPress={() => Linking.openURL('maps://app?daddr='+_destination)}>
                      <Image style={{width:35, height:38}} source={require('../../../../assets/icon-apple-maps.png')} />
                    </TouchableOpacity>
                  :
                    <View></View>
                  }
                </View>
              </View>
          </View>
      </View>
    )
  }
  openWaze(lat,lng,destination){
    Linking.canOpenURL('waze://')
      .then((supported) => {
        if (supported) {
          //https://waze.com/ul?q=66%20Acacia%20Avenue&ll=31.467277,74.265905&navigate=yes
          let _url = `https://waze.com/ul?q=${destination}&ll=${lat},${lng}&navigate=yes`
          Linking.openURL(encodeURI(_url))
        }else{
          alert('Waze app is not installed on your device.')
        }

      }).catch((error) => {
        alert(error)
      })
  }
  opengoogleMaps(lat,lng,label){
     let _url = Platform.select({
            ios: `comgooglemaps://?&daddr=${label}&directionsmode=driving&zoom=10`,
            android: `google.navigation:q=${label}&mode=d`
          })
     Linking.canOpenURL(_url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(_url); 
        }else{
          alert('Google Maps is not installed on your device.')
        }

      }).catch((error) => {
        console.log('linking error', error)
      })
  }
  iosMap(){
    return(
      <View style={{flex:1}}>
        <MapView
        ref={component => this._map = component}
        onMapReady={this.onMapReady}
        coordinate={{"latitude":this.state.lat,"longitude":this.state.long}}
        showsUserLocation = {false}
        style = {{flex:1,top:0,bottom:0,right:0,left:0,zIndex: -1}}
        >
          <Marker
          coordinate={this.state.region}>
            <Image source={require('../../../../assets/userLocationMarker.png')} style={{height:30 , width:30}} />
          </Marker>
            {this.state.stores.map(marker => (
              
                <Marker
                  coordinate={{latitude:+marker.lat, longitude:+marker.lon}}
                  key={marker.lat}
                  title = {marker.name}
                  onPress={() => this.pushSelectedStore(marker)}
                  description={
                      (marker.store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_to`] && marker.store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_from`])?
                        (new Date().getHours()<parseInt(marker.store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_to`].substring(0, 2))
                        && new Date().getHours()>parseInt(marker.store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_from`].substring(0, 2))
                        )?
                        `(Open Now) Working hours: ${this.renderTimeFormat(marker.store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_from`])} - ${this.renderTimeFormat(marker.store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_to`])}`
                        :
                        `(Closed) Working hours: ${this.renderTimeFormat(marker.store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_from`])} - ${this.renderTimeFormat(marker.store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_to`])}`
                      :
                      null
                  }
                  >
                    <Image source={require('../../../../assets/clientstores_marker.png')} style={{height:50 , width:38}} / >
                </Marker>  
               
            ))}
            {this.state.destination!=null?
            <MapViewDirections
              origin={this.state.region}
              destination={this.state.destination}
              apikey="AIzaSyDEIYSnYoApn6S6fvFlTxCKuwrb3FoguU8"
              strokeWidth={3}
              strokeColor="#FF7600"
            />: null}
            
        </MapView>
        {this.state.selectedStore.length>0? this.renderDirectionBlock():null }
      </View>
      
    )
  }
  androidMap(){
    return(
      <View style = {{flex:1}}>
        <MapView
          provider="google"
          initialRegion={this.state.region}
          onMapReady={this.onMapReady}
          showsUserLocation={true}
          style = {{flex:1,top:0,bottom:0,right:0,left:0,zIndex: -1}}
          ref={map => {
            this._map = map;
          }}
        >
          <Marker
              coordinate={this.state.region}>
                <Image source={require('../../../../assets/userLocationMarker.png')} style={{height:30 , width:30}} />
          </Marker>
          {this.state.stores.map(marker => (
            
              <Marker
                coordinate={{latitude:+marker.lat, longitude:+marker.lon}}
                title = {marker.name}
                key={marker.lat}
                //onPress={this.pushSelectedStore(marker)}
                onPress={() => this.pushSelectedStore(marker)}
                description={
                  (marker.store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_to`] && marker.store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_from`])?
                    (new Date().getHours()<parseInt(marker.store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_to`].substring(0, 2))
                    && new Date().getHours()>parseInt(marker.store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_from`].substring(0, 2))
                    )?
                    `(Open Now) Working hours: ${this.renderTimeFormat(marker.store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_from`])} - ${this.renderTimeFormat(marker.store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_to`])}`
                    :
                    `(Closed) Working hours: ${this.renderTimeFormat(marker.store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_from`])} - ${this.renderTimeFormat(marker.store_info[`${this.state.daysCharacters[this.state.dayNumeric]}_hours_to`])}`
                  :
                  null
                }
                >
                  <Image source={require('../../../../assets/clientstores_marker.png')} style={{height:50 , width:38}} / >
              </Marker>  
              
          ))}
          
            {this.state.destination!=null?
            <MapViewDirections
              origin={this.state.region}
              destination={this.state.destination}
              apikey="AIzaSyDEIYSnYoApn6S6fvFlTxCKuwrb3FoguU8"
              strokeWidth={5}
              strokeColor="#FF7600"
            />: null}
        </MapView>
        {this.state.selectedStore.length>0? this.renderDirectionBlock():null }
      </View >
    )
  }
  
  render() {
    const {region, isMounted} = this.state
    return (
        isMounted ?
        <View style={[styles.containerBlue]}>
          <View style={styles.lightBlueContainerMedium}>
            <View style={{display:'flex', flexDirection: 'row',justifyContent:"center",marginLeft:20,marginRight:25,marginTop:util.HP(3)}}>
                <Text style={styles.h1ListTitle}>
                  client Stores Locations
                </Text>
            </View>
          </View>
          <View style={{display:"flex",zIndex:1,alignItems:'center',height:util.WP(16),backgroundColor:'#fff',flexDirection:'row',margin:util.WP(5),paddingLeft:util.WP(5),paddingRight:util.WP(10),top:util.WP(6),marginTop:0,marginBottom:0}}>
            <Image style={{height:util.WP(5),width:util.WP(5),marginRight:util.WP('2')}} resizeMode="contain" source={require('../../../../assets/search-blue.png')} />
            <TextInput
              style={{fontFamily: "Montserrat-SemiBold",color:'#00355F',fontSize:util.WP(5),width:'100%',height:'100%'}}
              placeholder={"Search"}
              placeholderTextColor='#00355F'
              value = {this.state.searchTerm}
              onChangeText = {(text)=>this.triggerSearch(text)}
              >
            </TextInput>
          </View>
          {
            this.state.isSearching ? 
            this.state.searchResults.length>0?
              <View style={{display:"flex",width:util.WP(90),zIndex:1,position:'absolute',top:util.WP(28),height:util.WP(40),alignItems:'center',backgroundColor:'#fff',margin:util.WP(5),paddingLeft:util.WP(5),paddingRight:util.WP(5)}}>
              <FlatList
               //style={{height:util.WP(20)}}
                data={this.state.searchResults}
                extraData = {this.state.refresh}
                renderItem={({ item: rowData,index }) => {
                  return (
                        <TouchableOpacity
                          onPress={()=>this.pushSelectedStore(rowData)}
                        >
                          <View style={styles.listView}>
                            <Text style={styles.listName}>
                              {rowData.name}
                            </Text>
                            <Text style={{fontSize:12,fontFamily:'Montserrat-Regular',marginTop:2,color:'#2E2E2E'}}>
                            {/* { ((rowData.stuff).length > util.WP('10')) ? 
                              (((rowData.stuff).substring(0,util.WP('12')-3)) + '...') : 
                              rowData.stuff } */}
                              {rowData.address_line_one}
                            </Text>
                          </View>
                   </TouchableOpacity>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
              />
              </View>
             : 
               <View style={{display:"flex",width:util.WP(90),zIndex:1,position:'absolute',top:util.WP(28),height:util.WP(40),alignItems:'center',backgroundColor:'#fff',margin:util.WP(5),paddingLeft:util.WP(5),paddingRight:util.WP(5)}}>
                <View style={styles.listView}>
                            <Text style={{fontSize:14,fontFamily:'Montserrat-Regular',marginTop:2,color:'#2E2E2E'}}>
                              No store found in your country!
                            </Text>
                          </View>
              </View>
              : null
           }
          
          
          <View style = {{flex:1,top:0,bottom:0,left:0,right:0}}>
          {
            Platform.OS === 'ios' ?
            this.iosMap()
            :
            this.androidMap()
          }
          </View>

        </View>
        :
        <View></View>
    )
  }

}
mapStateToProps = state => {
    return {
        lumperShown: state.ui.isLoading,
        user:state.login.user,
        clientStores:state.login.stores,
        country:state.login.country,
        defaultCountries:state.login.defaultCountries,
    }
  }
  mapDispatchToProps = dispatch => {
    return {
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(StoresMap);