import React, {Component} from 'react';
import {initStore} from './src/redux/store';
import {Provider} from 'react-redux';
import { StatusBar, SafeAreaView, Dimensions, BackHandler } from 'react-native';
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import Router from './src/Routes';
import SyncStorage from 'sync-storage';
import { MenuProvider } from 'react-native-popup-menu';
import InjectCommonProps from './src/InjectCommonProps';
import Footer from './src/components/common/Footer';

const store = initStore();

class App extends Component {
  state = {
    routeName: '',
    currentIndex: null,
    socket: null,
  }

  _onNavigationChange = (prevState, newState, action) => {
    if (action.type == 'Navigation/NAVIGATE') {
      this.setState({
        routeName: action.routeName
      })
    }
    if (prevState.index !== newState.index) {
      this.setState({
        currentIndex: newState.index
      })
    }
  }

  navigate = (routeName) => {
    this.container.dispatch(
      NavigationActions.navigate({
        type: 'Navigation/NAVIGATE',
        routeName
      }),
    );
  }

  willFocusSubscription = () => {
    let { routeName } = this.state
    if (routeName === 'ForgotPassword') {
      BackHandler.exitApp()
      return true;
    }
  }

  componentDidMount() {
    // SplashScreen.hide()
    BackHandler.addEventListener('hardwareBackPress', this.willFocusSubscription)
  }
  

  setSocket = (socket) => {
    this.setState({
      socket
    })
  }

  closeSocket = () => {
    this.state.socket && this.state.socket.disconnect()
  }

  render () {
    console.disableYellowBox =  true;
    return (
      <Provider store={store}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
        <NavigationContainer>
          <InjectCommonProps />
          <MenuProvider>
            <Router 
              onNavigationStateChange={this._onNavigationChange}
              ref={(c) => { this.container = c }}
              screenProps={{ ...this.state, setSocket: this.setSocket, closeSocket: this.closeSocket }}
            />
          </MenuProvider>
        </NavigationContainer>
        </SafeAreaView>
      </Provider>
    );
  }
}

export default App;