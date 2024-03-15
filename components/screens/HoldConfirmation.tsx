import React, {useContext} from "react";

import {Text} from "react-native-paper";

import HoldContext from "../../store/hold-context";
import {RootStackScreenProps} from "../../types/navigation";

const HoldConfirmation = ({}: RootStackScreenProps<"HoldConfirmation">) => {
  const {hold} = useContext(HoldContext);

  return (
    <Text variant="headlineLarge">{`You've won ${hold?.numSeats} ticket(s) to`}</Text>
  );
};

export default HoldConfirmation;
