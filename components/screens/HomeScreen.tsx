import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

const HomeScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Home Screen</Text>
  </View>
);

export default HomeScreen;

const styles = StyleSheet.create({
  screenContainer: {flex: 1, alignItems: 'center', justifyContent: 'center'}
});
