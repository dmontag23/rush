import React from "react";
import {StyleSheet, View} from "react-native";

import {Button, Text} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import {formatLocationName} from "./locationUtils";

import useStoreLocation from "../../hooks/asyncStorageHooks/useStoreLocation";
import {TodayTixLocation} from "../../types/shows";

type LocationItemProps = {
  location: keyof typeof TodayTixLocation;
  isChecked?: boolean;
  onPress?: () => void;
};

const LocationItem = ({
  location,
  isChecked = false,
  onPress
}: LocationItemProps) => {
  const {mutate: storeLocation} = useStoreLocation();

  return (
    <Button
      onPress={() => {
        storeLocation(TodayTixLocation[location]);
        onPress?.();
      }}
      labelStyle={styles.buttonLabel}>
      <View style={styles.labelContainer}>
        <Text>{formatLocationName(location)}</Text>
        {isChecked && <MaterialCommunityIcons name="check" size={24} />}
      </View>
    </Button>
  );
};

export default LocationItem;

const styles = StyleSheet.create({
  buttonLabel: {flex: 1},
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  }
});
