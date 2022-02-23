import NetInfo from "@react-native-community/netinfo";
import { Platform, BackHandler, PermissionsAndroid } from 'react-native';
import * as Util from '../index';
import Toast from 'react-native-root-toast';
import Geolocation from '@react-native-community/geolocation';
import { SkypeIndicator, DotIndicator } from 'react-native-indicators';
import React, { Component } from 'react';
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
export const INTERNET_CONNECTION_ERROR = "Please check your internet connection and try again!!!";
import ImagePicker from 'react-native-image-picker';
import * as TASKS from '../../store/actions/index';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';


export const emailValidator = (val) => {
    return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
        val
    );
};

export const passwordValidator = (val) => {
    let reg = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{7,}$/
    return reg.test(val)
}
export const getPicture = (success, reject) => {
    //dispatch(TASKS.showLoader());
    const options = {
        title: 'Select Avatar',
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
    };

    ImagePicker.showImagePicker(options, (response) => {
        console.log('camera response', response)
        if (response.didCancel) {
            // console.log('User cancelled photo picker');
            reject()
        }
        else if (response.error) {
            // console.log('ImagePicker Error: ', response.error);
            reject()
        }
        else if (response.customButton) {
            // console.log('User tapped custom button: ', response.customButton);
        }
        else {
            let source = { uri: `data:image/jpeg;base64,${response.data}` };
            success(source)
        }
    });
}
export const isOnline = (success, reject) => {
    NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected) {
            success(true);
        } else
            reject(false);
    })
}

export const getLocation = async (success, failure) => {
    var userCountry = []
    let hasPermission = true
    if (Platform.OS == 'android') {
        hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        )
        if (!hasPermission) {
            const status = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            )
            hasPermission = status === PermissionsAndroid.RESULTS.GRANTED

            if (!hasPermission) {
                console.log('[error code]',PERMISSION_DENIED_ERROR_CODE)
                failure({ code: PERMISSION_DENIED_ERROR_CODE, message: 'Permission Denied' })
            }
        }
    }
    if (hasPermission) {
        Geolocation.getCurrentPosition(
            (position) => {

                success(position)
            },
            (error) => {
                // See error code charts below.
                // failure(error)
                if (RNAndroidLocationEnabler!=null) {
                    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
                .then(data => {
                  // The user has accepted to enable the location services
                  // data can be :
                  //  - "already-enabled" if the location services has been already enabled
                  //  - "enabled" if user has clicked on OK button in the popup
                }).catch(err => {
                  // The user has not accepted to enable the location services or something went wrong during the process
                  // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
                  // codes : 
                  //  - ERR00 : The user has clicked on Cancel button in the popup
                  //  - ERR01 : If the Settings change are unavailable
                  //  - ERR02 : If the popup has failed to open
                });   
                }

            },
            { timeout: 10000, maximumAge: 5000 }
        );

    }
}



export const showToast = (message) => {
    
// Add a Toast on screen.
    Toast.show(message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
    });
    // if ( Platform.OS === 'ios')
    //     Toast.show(message, Toast.durations.LONG , Toast.positions.CENTER , Util.iosToastStyle);
    // else
    //     Toast.show(message, Toast.durations.LONG, Toast.positions.BOTTOM, Util.androidtoastStyle);
}

export const backendErrorMessage = (error, text) => {
    if (error.data)
        showToast(error.data);
    else
        showToast(text);
}

export const currencyFormat = (num) => {
    console.log('called.....')
  return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
export const Lumper = (props) => {
    return (
        props.lumper == true ? <SkypeIndicator color={props.color} size={props.size} /> :
            <DotIndicator color={props.color} size={props.size} />
    );
}

export const isWEBURL = (url) => {
    var re_weburl = new RegExp(
        "^" +
        // protocol identifier
        "(?:(?:https?|ftp)://)" +
        // user:pass authentication
        "(?:\\S+(?::\\S*)?@)?" +
        "(?:" +
        // IP address exclusion
        // private & local networks
        "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
        "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
        "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
        // IP address dotted notation octets
        // excludes loopback network 0.0.0.0
        // excludes reserved space >= 224.0.0.0
        // excludes network & broacast addresses
        // (first & last IP address of each class)
        "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
        "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
        "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
        "|" +
        // host name
        "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
        // domain name
        "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
        // TLD identifier
        "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
        // TLD may end with dot
        "\\.?" +
        ")" +
        // port number
        "(?::\\d{2,5})?" +
        // resource path
        "(?:[/?#]\\S*)?" +
        "$", "i"
    );
    return re_weburl.test(url);
}

export const getMaxDateForDatePicker = (val, checkValue) => {
    var date = new Date();
    var day, month = (date.getMonth() + 1), year;
    if (date.getDate() < 10)
        day = '0' + date.getDate();
    else
        day = date.getDate();

    if (month < 10)
        month = '0' + month;
    return date.getFullYear() + '-' + month + '-' + day;
};
export const getFacebookDetails = (success, reject) => {
    LoginManager.logOut();
    LoginManager.logInWithPermissions(['public_profile','email']).then(
        function (result) {
            if (result.isCancelled) {
                reject()

            } else {
                AccessToken.getCurrentAccessToken().then(data => {
                    const { accessToken } = data
                    fetch('https://graph.facebook.com/v2.5/me?fields=email,picture.type(large),first_name,last_name,address&access_token=' + accessToken)
                        .then((response) => response.json())
                        .then((json) => {
                            success(json)
                        })
                        .catch(() => {
                            reject()
                        })
                });
            }
        },
        function (error) {
            console.log('Login fail with error: ' + error)
        }
    )

};

export const covertImgToBase64 = (imageToBeConverted,success,reject)=>{
    if(imageToBeConverted){
        var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
        var encodedString = Base64.encode(imageToBeConverted);
       success(`data:image/jpeg;base64,${encodedString}`)  // Outputs: "SGVsbG8gV29ybGQh"

    }
    else{
        reject()
    }
 
    
}
export const enableLocation = ()=>{
    if (RNAndroidLocationEnabler!=null) {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
    .then(data => {
      // The user has accepted to enable the location services
      // data can be :
      //  - "already-enabled" if the location services has been already enabled
      //  - "enabled" if user has clicked on OK button in the popup
    }).catch(err => {
      // The user has not accepted to enable the location services or something went wrong during the process
      // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
      // codes : 
      //  - ERR00 : The user has clicked on Cancel button in the popup
      //  - ERR01 : If the Settings change are unavailable
      //  - ERR02 : If the popup has failed to open
    });   
    }
}

