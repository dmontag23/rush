import React from "react";
import {StyleSheet} from "react-native";

import {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {useTheme} from "react-native-paper";

import LocationItem from "./LocationItem";

import useGetLocation from "../../hooks/asyncStorageHooks/useGetLocation";
import {TodayTixLocation} from "../../types/shows";

type LocationsContainerProps = {
  onItemPress?: () => void;
};

const LocationsContainer = ({onItemPress}: LocationsContainerProps) => {
  const {colors} = useTheme();

  const {data: currentLocation} = useGetLocation();

  const locations = Object.keys(TodayTixLocation).filter(key =>
    isNaN(Number(key))
  ) as Array<keyof typeof TodayTixLocation>;

  return (
    <BottomSheetScrollView
      contentContainerStyle={[
        styles.locationsContainer,
        {backgroundColor: colors.surfaceVariant}
      ]}>
      {locations.map((location, i) => (
        <LocationItem
          key={i}
          location={location}
          isChecked={currentLocation === TodayTixLocation[location]}
          onPress={onItemPress}
        />
      ))}
    </BottomSheetScrollView>
  );
};

export default LocationsContainer;

const styles = StyleSheet.create({
  locationsContainer: {
    gap: 10,
    marginHorizontal: "10%",
    marginTop: 20,
    borderRadius: 10
  }
});
