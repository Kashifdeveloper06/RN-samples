import React, { Component } from 'react';
import * as util from '../../../utilities'
import { Button, Text, View,Linking, Alert,TouchableOpacity,
 Image} from 'react-native';
import { Card } from "react-native-elements";
import { styles } from '../../../styles';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import { connect } from 'react-redux';
import * as TASKS from '../../../store/actions';

class ScanCard extends React.Component {
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
        focusedScreen:false,
        isBarcode:false,
        isScanning:false,
	      camera: {
	        type: RNCamera.Constants.Type.back,
			flashMode: RNCamera.Constants.FlashMode.auto,
	      }
	    };
    }
    componentDidMount(){
      const { navigation } = this.props;
    navigation.addListener('willFocus', () =>
      this.setState({ focusedScreen: true })
    );
    navigation.addListener('willBlur', () =>
      this.setState({ focusedScreen: false,isBarcode:false })
    );
    }
 	onBarCodeRead(scanResult) {
	    if (scanResult.data != null) {
        this.setState({
          isBarcode:true,
          isScanning:true
        })
        this.props.navigation.state.params.onGoBack(scanResult.data.slice(1, -1));
        this.props.navigation.goBack();

  			if (!this.barcodeCodes.includes(scanResult.data)) {}
	    }
	    return;
    }

    cameraView(){
      return (
        <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            defaultTouchToFocus
            flashMode={this.state.camera.flashMode}
            mirrorImage={false}
            captureAudio={false}
            onBarCodeRead={this.onBarCodeRead.bind(this)}
            onFocusChanged={() => {}}
            notAuthorizedView={
            <View style={{
                flex: 1, 
                alignItems: 'flex-start',
                justifyContent: 'center',
                width:'80%',
                marginLeft:18 
            }}>
                <Text style={{...styles.h1Title, ...styles.orangeButtonText}}>
                    Your Camera is Disabled!
                </Text>
                <Text style={{...styles.h3Title, marginLeft:0}}>
                    client Stores requires your permission to access your camera.
                </Text>
                <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:20}}>
                  <TouchableOpacity
                    style={{...styles.containerButton, width:'50%', padding:10}}
                    onPress= {() => Linking.openURL('app-settings://clientStores')}
                    >
                      <Text style={{fontSize: 14,fontFamily:'Montserrat-SemiBold',color:'#fff'}}>Enable From Settings</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{...styles.containerButton, width:'20%', padding:10, marginLeft:5}}
                    onPress= {() => this.props.navigation.goBack()}
                    >
                      <Text style={{fontSize: 14,fontFamily:'Montserrat-SemiBold',color:'#fff'}}>Back</Text>
                  </TouchableOpacity>
                  
                </View>
            </View>
          }
            onZoomChanged={() => {}}
            style={styles.cameraPreview}
            type={this.state.camera.type}
        >
        <View style={styles.scannerCancelContainer}>
        	<TouchableOpacity
        	onPress={ () => this.props.navigation.goBack()}
        	>
        	<Image style={{height:util.WP(7),width:util.WP(7)}} source={require('../../../../assets/close-white.png')} />
        	</TouchableOpacity>
        </View>
        <View style={styles.scannerContentContainer}>
            <Text numberOfLines={5} style={styles.scannerText}>
                Place the client Card barcode in the frame to Connect. For best performance please hold card in well lit room or natural light.
        	</Text>
        	<Image style={{marginRight:10,height:util.WP(10),width:util.WP(10)}} source={require('../../../../assets/button-lightning.png')} />
        </View>
        	<BarcodeMask edgeColor={'#FFD700'} width={util.WP('80')} height={util.HP('30')} showAnimatedLine={false}/>
        	<View style={{marginLeft:20,marginRight:10,top:util.HP('43'),width:'97%'}}>
              {/*Single Card*/}
              {this.props.lumperShown?<View style={{paddingTop:10}}>{util.Lumper({ lumper: true,color:"#fff" })}</View>:null}
          </View>
        </RNCamera>
      );
    }
  render() {
    return (
      <View style={styles.cameraContainer}>
        {this.state.focusedScreen?this.cameraView():null}
      </View>
    );
  }
}

mapStateToProps = state => {
  return {
      lumperShown: state.ui.isLoading,
      user:state.login.user
  }
}
mapDispatchToProps = dispatch => {
  return {
    connectCard: (cardNumber) => dispatch(TASKS.connectCard(cardNumber)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScanCard);
