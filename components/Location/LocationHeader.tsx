import React from "react";
import {StyleSheet, View} from "react-native";

import {Button, Text} from "react-native-paper";

const CLOSE_BUTTON_PADDING = 6;

type LocationHeaderProps = {
  onCloseButtonPress: () => void;
};

const LocationHeader = ({onCloseButtonPress}: LocationHeaderProps) => (
  <View style={styles.header}>
    <View style={[styles.headerItem, {paddingLeft: CLOSE_BUTTON_PADDING}]}>
      <Button onPress={onCloseButtonPress} style={styles.button}>
        Close
      </Button>
    </View>
    <Text variant="titleLarge" style={[styles.headerItem, styles.headerText]}>
      Location
    </Text>
    {/* Create an empty View with the same dimensions as the first View to center the Location header */}
    <View style={[styles.headerItem, {paddingRight: CLOSE_BUTTON_PADDING}]} />
  </View>
);

export default LocationHeader;

const styles = StyleSheet.create({
  button: {width: 60},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerItem: {flex: 1},
  headerText: {textAlign: "center"}
});
