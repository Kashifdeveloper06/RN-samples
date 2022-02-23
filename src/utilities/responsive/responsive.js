import { Dimensions, PixelRatio,Platform } from 'react-native';

const widthPercentageToDP = widthPercent => {
    const screenWidth = Dimensions.get('window').width;
    // Convert string input to decimal number
    const elemWidth = parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
};
const heightPercentageToDP = heightPercent => {
    const screenHeight = Dimensions.get('window').height;
    // Convert string input to decimal number
    const elemHeight = parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
};
export {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP
};
export const isIphoneX = () => {
    const dimen = Dimensions.get('window')
    return (
        Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS &&
        (dimen.height === 812 || dimen.width === 812)
    )
}

export const isIphoneXSM = () => {
    const dimen = Dimensions.get('window')

    return (
         Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS &&
         (dimen.height === 896 || dimen.width === 896)   
    )
}
