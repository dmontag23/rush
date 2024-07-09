import React, {useContext, useEffect} from "react";
import {StyleSheet, View} from "react-native";

import {useNavigation} from "@react-navigation/native";
import {Banner, BannerProps, Text} from "react-native-paper";

import LoadingSpinner from "./ui/LoadingSpinner";
import {pluralize} from "./utils";

import useDeleteHold from "../hooks/todayTixHooks/useDeleteHold";
import useCountdown from "../hooks/useCountdown";
import useGetCustomerId from "../hooks/useGetCustomerId";
import HoldContext from "../store/hold-context";
import SelectedShowtimeContext from "../store/selected-showtime-context";

type HoldBannerProps = {
  style?: BannerProps["style"];
};

const HoldBanner = ({style}: HoldBannerProps) => {
  const {customerId} = useGetCustomerId();
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
    isCreatingHold,
    createHoldError,
    isHoldScheduled,
    scheduleHold,
    cancelHold,
    hold
  } = useContext(HoldContext);

  const {mutate: deleteHold, isSuccess: isDeleteHoldSuccess} = useDeleteHold();

  useEffect(() => {
    if (isDeleteHoldSuccess) {
      setSelectedShow(undefined);
      setSelectedShowtime(undefined);
      setSelectedNumberOfTickets(NaN);
    }
  }, [
    isDeleteHoldSuccess,
    setSelectedNumberOfTickets,
    setSelectedShow,
    setSelectedShowtime
  ]);

  const {countdown: countdownToRushOpening} = useCountdown(
    showtime?.rushTickets?.availableAfterEpoch
  );

  const retryPlacingHold = () => {
    cancelHold();
    if (customerId && showtime && numberOfTickets && !hold)
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
    if (hold)
      return {
        actions: [
          {
            label: "Release tickets",
            onPress: () => deleteHold(hold.id)
          },
          {
            label: "See tickets",
            onPress: () => navigate("HoldConfirmation")
          }
        ],
        children: `You have ${hold.numSeats} ticket${pluralize(hold.numSeats)} to ${hold.showtime.show?.displayName}!`
      };
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
    Boolean(hold) ||
    isCreatingHold ||
    Boolean(createHoldError) ||
    isHoldScheduled;

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
