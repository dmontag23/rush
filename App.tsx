import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import React from 'react';
import {
  adaptNavigationTheme,
  MD3LightTheme,
  PaperProvider
} from 'react-native-paper';
import {hadestownLightThemeColors} from './themes';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './components/screens/HomeScreen';

export type RootStack = {
  Home: undefined;
};
const Stack = createNativeStackNavigator<RootStack>();

const LIGHT_THEME = {...MD3LightTheme, colors: hadestownLightThemeColors};
const {LightTheme: NAV_LIGHT_THEME} = adaptNavigationTheme({
  reactNavigationLight: DefaultTheme,
  materialLight: LIGHT_THEME
});

const App = () => (
  /* PaperProvider should be the innermost provider for the app.
     See https://callstack.github.io/react-native-paper/docs/guides/getting-started */
  <PaperProvider theme={LIGHT_THEME}>
    <NavigationContainer theme={NAV_LIGHT_THEME}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  </PaperProvider>
);

export default App;
