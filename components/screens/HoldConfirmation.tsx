import React, {useContext} from "react";
import {SafeAreaView} from "react-native";

import {Text} from "react-native-paper";

import HoldContext from "../../store/hold-context";
import {RootStackScreenProps} from "../../types/navigation";

const HoldConfirmation = ({}: RootStackScreenProps<"HoldConfirmation">) => {
  const {hold} = useContext(HoldContext);

  return (
    <SafeAreaView>
      <Text variant="headlineLarge">{`You've won ${hold?.numSeats} ticket(s) to ${hold?.showtime.show?.displayName}!`}</Text>
    </SafeAreaView>
  );
};

export default HoldConfirmation;
