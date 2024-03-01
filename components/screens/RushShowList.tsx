import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import ShowCard from '../ShowCard';
import {TodayTixShowtime} from '../../types/showtimes';
import {RootStack} from './RootNavigator';
import {StackScreenProps} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from 'react-native-paper';

const addTickets = (showtimes: TodayTixShowtime[]) =>
  showtimes.reduce(
    (ticketCount, showtime) =>
      ticketCount + (showtime.rushTickets?.quantityAvailable ?? 0),
    0
  );

const RushShowList = ({route}: StackScreenProps<RootStack, 'RushShowList'>) => {
  const {top} = useSafeAreaInsets();
  const {showsAndTimes} = route.params;

  const sortedRushShows = [...showsAndTimes].sort(
    (a, b) =>
      addTickets(b.showtimes) - addTickets(a.showtimes) ||
      (b.showtimes[0]?.rushTickets?.availableAfterEpoch ?? 0) -
        (a.showtimes[0]?.rushTickets?.availableAfterEpoch ?? 0)
  );

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top,
          backgroundColor: useTheme().colors.inversePrimary
        }
      ]}>
      <ScrollView
        testID="rushShows"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}>
        {sortedRushShows.map(({show, showtimes}) => (
          <ShowCard key={show.id} show={show} showtimes={showtimes} />
        ))}
      </ScrollView>
    </View>
  );
};

export default RushShowList;

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: 20},
  scrollContentContainer: {rowGap: 15}
});
