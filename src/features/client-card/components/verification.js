import React, { Component } from "react";
import {
  Alert,
  Animated,
  Image,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import * as util from "../../../utilities";
import * as TASKS from "../../../store/actions";
import analytics from "@react-native-firebase/analytics";

import CodeFiled from "react-native-confirmation-code-field";

import styles, {
  ACTIVE_CELL_BG_COLOR,
  CELL_BORDER_RADIUS,
  CELL_SIZE,
  DEFAULT_CELL_BG_COLOR,
  NOT_EMPTY_CELL_BG_COLOR,
} from "./styles";

const codeLength = 4;

const source = {
  uri:
    "https://user-images.githubusercontent.com/4661784/56352614-4631a680-61d8-11e9-880d-86ecb053413d.png",
};

class Verification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isResendingCode: false,
    };
    this.screenanalytics();
  }

  async screenanalytics() {
    await analytics().setCurrentScreen(
      "ConnectCardSuccess",
      "ConnectCardSuccess"
    );
  }
  componentDidMount() {
    this.props.apiResponse(null);
    this.props.apiResponseCode(0);
    this.props.apiResponseText(null);
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.apiCode !== this.props.apiCode &&
      this.props.apiCode === 200
    ) {
      this.setState({ isResendingCode: false });
    }
  }

  _animationsColor = [...new Array(codeLength)].map(
    () => new Animated.Value(0)
  );
  _animationsScale = [...new Array(codeLength)].map(
    () => new Animated.Value(1)
  );

  onFinishCheckingCode = (code) => {
    this.props.verifyCard({ verificationCode: code });
  };

  animateCell({ hasValue, index, isFocused }) {
    Animated.parallel([
      Animated.timing(this._animationsColor[index], {
        toValue: isFocused ? 1 : 0,
        duration: 250,
      }),
      Animated.spring(this._animationsScale[index], {
        toValue: hasValue ? 0 : 1,
        duration: hasValue ? 300 : 250,
      }),
    ]).start();
  }

  cellProps = ({ hasValue, index, isFocused }) => {
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? this._animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          })
        : this._animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }),
      borderRadius: this._animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
      }),
      transform: [
        {
          scale: this._animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          }),
        },
      ],
    };

    // Run animation on next event loop tik
    // Because we need first return new style prop and then animate this value
    setTimeout(() => {
      this.animateCell({ hasValue, index, isFocused });
    }, 0);

    return {
      style: [styles.input, animatedCellStyle],
    };
  };

  containerProps = { style: styles.inputWrapStyle };

  render() {
    /*concept : https://dribbble.com/shots/5476562-Forgot-Password-Verification/attachments */
    return (
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Verification</Text>
        <Image style={styles.icon} source={source} />
        <Text style={styles.inputSubLabel}>
          {
            "Please enter the verification code \nwe have sent you via SMS and email."
          }
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.setState({ isResendingCode: true });
              setTimeout(() => {
                this.props.resendVerificationCode();
              }, 500);
            }}
          >
            <Text
              style={{
                ...styles.inputSubLabel,
                paddingTop: 10,
                textDecorationLine: "underline",
                fontFamily: "Montserrat-Bold",
                color: "#FB7300",
              }}
            >
              re-send code again!
            </Text>
          </TouchableOpacity>
          {this.props.apiResponseStatus && this.props.apiCode == "200" ? (
            <Text
              style={{
                marginLeft: 5,
                paddingTop: 10,
                fontFamily: "Montserrat-SemiBold",
                color: "#00355F",
              }}
            >
              Code sent
            </Text>
          ) : (
            <Text />
          )}
          <View style={{ marginLeft: 5, paddingTop: 10 }}>
            {this.state.isResendingCode ? (
              util.Lumper({ lumper: true, color: "#FB7300", size: 17 })
            ) : (
              <Text />
            )}
          </View>
        </View>
        <CodeFiled
          maskSymbol=" "
          variant="clear"
          codeLength={codeLength}
          keyboardType="numeric"
          cellProps={this.cellProps}
          containerProps={this.containerProps}
          onFulfill={this.onFinishCheckingCode}
          CellComponent={Animated.Text}
        />
        <View style={styles.nextButton}>
          {this.props.lumperShown ? (
            util.Lumper({ lumper: true, color: "#fff" })
          ) : (
            <Text style={styles.nextButtonText}>Verify</Text>
          )}
        </View>
      </View>
    );
  }
}

mapStateToProps = (state) => {
  return {
    lumperShown: state.ui.isLoading,
    apiResponseStatus: state.ui.apiResponse,
    apiCode: state.ui.apiResponseCode,
    responseText: state.ui.responseText,
  };
};
mapDispatchToProps = (dispatch) => {
  return {
    verifyCard: (verificationCode) =>
      dispatch(TASKS.verifyCard(verificationCode)),
    resendVerificationCode: () => dispatch(TASKS.resendVerificationCode()),
    apiResponseText: (message) => dispatch(TASKS.apiResponseText(message)),
    apiResponse: (status) => dispatch(TASKS.apiResponse(status)),
    apiResponseCode: (code) => dispatch(TASKS.apiResponse(code)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Verification);
