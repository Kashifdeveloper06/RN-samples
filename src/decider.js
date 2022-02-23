import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Alert ,AsyncStorage} from 'react-native';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AppContext } from './context';
import { AppContainer } from './navigation';
import * as Util from './utilities'

class Decider extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {

    const { user } = this.props
    return (
      <AppContext.Provider value={user}>
        <AppContainer 
          ref={navigatorRef => {
            Util.setTopLevelNavigator(navigatorRef);
          }}
        />
      </AppContext.Provider>
    )
  }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: true,
        user: 'gohar'
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({

    }, dispatch)
};
export default connect(mapStateToProps, mapDispatchToProps)(Decider);
