import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {adaptNavigationTheme} from 'react-native-paper';
import {LIGHT_THEME} from '../../themes';
import EnterEmailScreen from './EnterEmailScreen';
import {View, StyleSheet} from 'react-native';
import EnterLinkScreen from './EnterLinkScreen';
import TodayTixLogoOnBackground from '../TodayTixLogoOnBackground';

export type RootStack = {
  EnterEmail: undefined;
  EnterLink: undefined;
};
const Stack = createNativeStackNavigator<RootStack>();

const {LightTheme: NAV_LIGHT_THEME} = adaptNavigationTheme({
  reactNavigationLight: DefaultTheme,
  materialLight: LIGHT_THEME
});

const RootNavigator = () => (
  <NavigationContainer theme={NAV_LIGHT_THEME}>
    <View style={styles.headerContainer}>
      <TodayTixLogoOnBackground />
    </View>
    <Stack.Navigator
      initialRouteName="EnterEmail"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="EnterEmail" component={EnterEmailScreen} />
      <Stack.Screen name="EnterLink" component={EnterLinkScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default RootNavigator;

const styles = StyleSheet.create({
  headerContainer: {height: '20%'}
});
