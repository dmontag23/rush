import React, {useContext} from "react";
import {StyleSheet, View} from "react-native";

import {useNavigation} from "@react-navigation/native";
import {Banner, BannerProps, Text} from "react-native-paper";

import LoadingSpinner from "./ui/LoadingSpinner";
import {pluralize} from "./utils";

import useCountdown from "../hooks/useCountdown";
import HoldContext from "../store/hold-context";
import SelectedShowtimeContext from "../store/selected-showtime-context";

type HoldBannerProps = {
  style?: BannerProps["style"];
};

const HoldBanner = ({style}: HoldBannerProps) => {
  const {navigate} = useNavigation();

  const {
    selectedShow: show,
    selectedShowtime: showtime,
    selectedNumberOfTickets: numberOfTickets,
    setSelectedShow,
    setSelectedShowtime,
    setSelectedNumberOfTickets
  } = useContext(SelectedShowtimeContext);

  const {
    isHoldScheduled,
    isPlacingHold,
    isHoldError,
    holdError,
    hold,
    retry: retryPlacingHold
  } = useContext(HoldContext);

  const {countdown: countdownToRushOpening} = useCountdown(
    showtime?.rushTickets?.availableAfterEpoch
  );

  const getBannerInfo = (): {
    actions?: BannerProps["actions"];
    children: BannerProps["children"];
  } => {
    if (hold)
      return {
        actions: [
          {label: "Release tickets"},
          {
            label: "See tickets",
            onPress: () => navigate("HoldConfirmation")
          }
        ],
        children: `You have ${hold.numSeats} ticket${pluralize(hold.numSeats)} to ${hold.showtime.show?.displayName}!`
      };
    if (isPlacingHold)
      return {
        children: (
          <View style={styles.placingHoldContainer}>
            <Text>{`Trying to get ${numberOfTickets} ticket${pluralize(numberOfTickets)} to ${show?.displayName}`}</Text>
            <LoadingSpinner />
          </View>
        )
      };
    if (isHoldError)
      return {
        actions: [{label: "Retry", onPress: retryPlacingHold}],
        children: `Oh no! There was an error getting tickets to ${show?.displayName}:\n${holdError?.message ?? holdError?.error}`
      };
    return {
      actions: [
        {
          label: "Cancel",
          onPress: () => {
            setSelectedShow(undefined);
            setSelectedShowtime(undefined);
            setSelectedNumberOfTickets(NaN);
          }
        }
      ],
      children: `Attempting to get ${numberOfTickets} ticket${pluralize(numberOfTickets)} for ${show?.displayName} in ${countdownToRushOpening}`
    };
  };

  const {actions, children} = getBannerInfo();

  return (
    <Banner
      visible={Boolean(hold) || isPlacingHold || isHoldError || isHoldScheduled}
      actions={actions}
      style={style}>
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
