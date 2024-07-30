import React, {useContext} from "react";
import {StyleSheet, View} from "react-native";

import {Banner, BannerProps, Text} from "react-native-paper";

import LoadingSpinner from "./ui/LoadingSpinner";
import {pluralize} from "./utils";

import useCountdown from "../hooks/useCountdown";
import useGetCustomerId from "../hooks/useGetCustomerId";
import HoldContext from "../store/hold-context";
import SelectedShowtimeContext from "../store/selected-showtime-context";

type HoldBannerProps = {
  style?: BannerProps["style"];
};

const HoldBanner = ({style}: HoldBannerProps) => {
  const {customerId} = useGetCustomerId();

  const {
    selectedShow: show,
    selectedShowtime: showtime,
    selectedNumberOfTickets: numberOfTickets,
    setSelectedShow,
    setSelectedShowtime,
    setSelectedNumberOfTickets
  } = useContext(SelectedShowtimeContext);

  const {
    isCreatingHold,
    createHoldError,
    isHoldScheduled,
    scheduleHold,
    cancelHold
  } = useContext(HoldContext);

  const {countdown: countdownToRushOpening} = useCountdown(
    showtime?.rushTickets?.availableAfterEpoch
  );

  const retryPlacingHold = () => {
    cancelHold();
    if (customerId && showtime && numberOfTickets)
      scheduleHold(0, {
        customerId,
        showtimeId: showtime.id,
        numTickets: numberOfTickets
      });
  };

  const getBannerInfo = (): {
    actions?: BannerProps["actions"];
    children: BannerProps["children"];
  } => {
    if (isCreatingHold)
      return {
        children: (
          <View style={styles.placingHoldContainer}>
            <Text>{`Trying to get ${numberOfTickets} ticket${pluralize(numberOfTickets)} to ${show?.displayName}`}</Text>
            <LoadingSpinner />
          </View>
        )
      };
    if (createHoldError)
      return {
        actions: [{label: "Retry", onPress: retryPlacingHold}],
        children: `Oh no! There was an error getting tickets to ${show?.displayName}:\n${createHoldError.message ?? createHoldError.error}`
      };
    if (isHoldScheduled)
      return {
        actions: [
          {
            label: "Cancel",
            onPress: () => {
              cancelHold();
              setSelectedShow(undefined);
              setSelectedShowtime(undefined);
              setSelectedNumberOfTickets(NaN);
            }
          }
        ],
        children: `Attempting to get ${numberOfTickets} ticket${pluralize(numberOfTickets)} for ${show?.displayName} in ${countdownToRushOpening}`
      };
    return {children: ""};
  };

  const {actions, children} = getBannerInfo();

  const isBannerVisible =
    isCreatingHold || Boolean(createHoldError) || isHoldScheduled;

  return (
    <Banner
      visible={isBannerVisible}
      actions={actions}
      style={style}
      testID="rushBanner">
      {children}
    </Banner>
  );
};

export default HoldBanner;

const styles = StyleSheet.create({
  placingHoldContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10
  }
});
