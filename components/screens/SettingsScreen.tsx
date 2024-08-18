import React, {useCallback, useRef} from "react";
import {SafeAreaView, StyleSheet, View} from "react-native";

import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {List, Surface, Text} from "react-native-paper";

import LocationBottomSheetModal from "../Location/LocationBottomSheetModal";
import {formatLocationName} from "../Location/locationUtils";

import useGetLocation from "../../hooks/asyncStorageHooks/useGetLocation";
import {TodayTixLocation} from "../../types/shows";

const createRightElement = (location: TodayTixLocation) => (
  <View style={styles.rightElement}>
    <Text variant="bodyMedium">
      {formatLocationName(
        TodayTixLocation[location] as keyof typeof TodayTixLocation
      )}
    </Text>
    <List.Icon icon="chevron-right" />
  </View>
);

const SettingsScreen = () => {
  const {data: location} = useGetLocation();

  const locationBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleLocationPress = useCallback(
    () => locationBottomSheetModalRef.current?.present(),
    []
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text variant="displaySmall" style={styles.titleText}>
          Settings
        </Text>
        <Surface mode="flat" style={styles.itemSurface}>
          <List.Item
            title="Location"
            onPress={handleLocationPress}
            right={() => location && createRightElement(location)}
            style={[styles.itemSurface, styles.listItem]}
          />
        </Surface>
      </SafeAreaView>
      <LocationBottomSheetModal innerRef={locationBottomSheetModalRef} />
    </>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {marginHorizontal: 10},
  itemSurface: {borderRadius: 10},
  listItem: {overflow: "hidden"},
  rightElement: {flexDirection: "row", alignItems: "center", gap: 5},
  titleText: {marginVertical: 20, textAlign: "center"}
});
