import React from "react";
import {ScrollView, StyleSheet, View} from "react-native";

import {useSafeAreaInsets} from "react-native-safe-area-context";

import HoldBanner from "../HoldBanner";
import ShowCard, {isShowActive} from "../ShowCard";
import LoadingSpinner from "../ui/LoadingSpinner";

import useGetShowtimesWithRushAvailability from "../../hooks/todayTixHooks/useGetShowtimesWithRushAvailability";
import useGrantRushAccessForAllShows from "../../hooks/useGrantRushAccessForAllShows";
import {RushShowsStackScreenProps} from "../../types/navigation";
import {TodayTixShow} from "../../types/shows";
import {TodayTixShowtime} from "../../types/showtimes";

const isRushUnlocked = (show: TodayTixShow, allUnlockedRushShowIds: number[]) =>
  allUnlockedRushShowIds.includes(show.showId ?? NaN);

const addTickets = (showtimes: TodayTixShowtime[]) =>
  showtimes.reduce(
    (ticketCount, showtime) =>
      ticketCount + (showtime.rushTickets?.quantityAvailable ?? 0),
    0
  );

const RushShowListScreen = ({
  route,
  navigation
}: RushShowsStackScreenProps<"RushShowList">) => {
  const {top, bottom} = useSafeAreaInsets();

  const {rushShows} = route.params;

  const {isGrantingAccess, rushGrants} =
    useGrantRushAccessForAllShows(rushShows);

  const {data: rushShowtimes, isPending: isLoadingRushShowtimes} =
    useGetShowtimesWithRushAvailability({
      showIds: rushShows.map(show => show.id)
    });

  if (isGrantingAccess || isLoadingRushShowtimes)
    return (
      <View style={styles.loadingSpinnerContainer}>
        <LoadingSpinner size="large" />
      </View>
    );

  const allUnlockedRushShowIds = rushGrants?.map(({showId}) => showId) ?? [];
  const showsAndTimes = rushShows.map((show, i) => ({
    show,
    showtimes: rushShowtimes[i] ?? []
  }));

  const sortedRushShows = showsAndTimes.sort((a, b) => {
    const firstShowActiveNumber = isShowActive(
      isRushUnlocked(a.show, allUnlockedRushShowIds),
      a.showtimes[0]
    )
      ? 1
      : -1;
    const secondShowActiveNumber = isShowActive(
      isRushUnlocked(b.show, allUnlockedRushShowIds),
      b.showtimes[0]
    )
      ? 1
      : -1;
    return (
      secondShowActiveNumber - firstShowActiveNumber ||
      addTickets(b.showtimes) - addTickets(a.showtimes)
    );
  });

  return (
    <View style={styles.container}>
      <HoldBanner style={{paddingTop: top}} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContentContainer,
          {paddingBottom: bottom}
        ]}
        testID="rushShows">
        {sortedRushShows.map(({show, showtimes}) => (
          <ShowCard
            key={show.id}
            show={show}
            showtimes={showtimes}
            isRushUnlocked={isRushUnlocked(show, allUnlockedRushShowIds)}
            onCardPress={() =>
              navigation.navigate("ShowDetails", {
                show,
                showtimes
              })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default RushShowListScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  loadingSpinnerContainer: {flex: 1, justifyContent: "center"},
  scrollContentContainer: {rowGap: 15, paddingHorizontal: 20, paddingTop: 10}
});
