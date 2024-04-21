import React, {useMemo} from "react";
import {ScrollView, StyleSheet, View} from "react-native";

import {useSafeAreaInsets} from "react-native-safe-area-context";

import ShowCard from "../ShowCard";
import LoadingSpinner from "../ui/LoadingSpinner";

import useGrantRushAccessForAllShows from "../../hooks/useGrantRushAccessForAllShows";
import {RootStackScreenProps} from "../../types/navigation";
import {TodayTixShowtime} from "../../types/showtimes";

const addTickets = (showtimes: TodayTixShowtime[]) =>
  showtimes.reduce(
    (ticketCount, showtime) =>
      ticketCount + (showtime.rushTickets?.quantityAvailable ?? 0),
    0
  );

const RushShowList = ({
  route,
  navigation
}: RootStackScreenProps<"RushShowList">) => {
  const {top, bottom} = useSafeAreaInsets();
  const {showsAndTimes} = route.params;

  const sortedRushShows = useMemo(
    () =>
      [...showsAndTimes].sort(
        (a, b) =>
          addTickets(b.showtimes) - addTickets(a.showtimes) ||
          (b.showtimes[0]?.rushTickets?.availableAfterEpoch ?? 0) -
            (a.showtimes[0]?.rushTickets?.availableAfterEpoch ?? 0)
      ),
    [showsAndTimes]
  );

  const allRushShows = useMemo(
    () => sortedRushShows.map(({show}) => show),
    [sortedRushShows]
  );

  const {isGrantingAccess, rushGrants} =
    useGrantRushAccessForAllShows(allRushShows);

  if (isGrantingAccess)
    return (
      <View style={styles.loadingSpinnerContainer}>
        <LoadingSpinner size="large" />
      </View>
    );

  const allUnlockedRushShowIds = rushGrants?.map(({showId}) => showId) ?? [];
  return (
    <View style={[styles.container]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContentContainer,
          {paddingTop: top, paddingBottom: bottom}
        ]}
        testID="rushShows">
        {sortedRushShows.map(({show, showtimes}) => (
          <ShowCard
            key={show.id}
            show={show}
            showtimes={showtimes}
            isRushUnlocked={allUnlockedRushShowIds.includes(show.showId ?? NaN)}
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

export default RushShowList;

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: 20},
  loadingSpinnerContainer: {flex: 1, justifyContent: "center"},
  scrollContentContainer: {rowGap: 15}
});
