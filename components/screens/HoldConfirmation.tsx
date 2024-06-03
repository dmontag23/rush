import React, {useContext} from "react";
import {SafeAreaView} from "react-native";

import {useNavigation} from "@react-navigation/native";
import {IconButton, Text} from "react-native-paper";

import {pluralize} from "../utils";

import HoldContext from "../../store/hold-context";
import {RootStackScreenProps} from "../../types/navigation";

const HoldConfirmation = ({}: RootStackScreenProps<"HoldConfirmation">) => {
  const {goBack} = useNavigation();
  const {hold} = useContext(HoldContext);

  return (
    <SafeAreaView>
      {/* TODO: Maybe refactor back button into UI component? */}
      <IconButton
        accessibilityLabel="Back button"
        icon="arrow-left"
        mode="contained-tonal"
        size={30}
        onPress={goBack}
      />
      <Text variant="headlineLarge">{`You've won ${hold?.numSeats} ticket${pluralize(hold?.numSeats)} to ${hold?.showtime.show?.displayName}!`}</Text>
    </SafeAreaView>
  );
};

export default HoldConfirmation;
