import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import SelectedShowtimeContext from '../../store/selected-showtime-context';
import {TodayTixShow} from '../../types/shows';
import {TodayTixShowtime} from '../../types/showtimes';

type RushShowTicketSelectionProps = {
  show: TodayTixShow;
  showtimes: TodayTixShowtime[];
};

const RushShowTicketSelection = ({
  show,
  showtimes
}: RushShowTicketSelectionProps) => {
  const {
    selectedShowtime,
    selectedNumberOfTickets,
    setSelectedShowtime,
    setSelectedNumberOfTickets
  } = useContext(SelectedShowtimeContext);

  const selectedShowtimeForThisShow =
    selectedShowtime &&
    showtimes.find(showtime => showtime.id === selectedShowtime.id);

  const minNumberOfTickets =
    selectedShowtimeForThisShow?.rushTickets?.minTickets ?? 0;
  const maxNumberOfTickets =
    selectedShowtimeForThisShow?.rushTickets?.maxTickets ?? 0;

  const numberOfTickets = Array.from(
    {length: maxNumberOfTickets - minNumberOfTickets + 1},
    (_, x) => x + minNumberOfTickets
  ).filter(number => number !== 0);

  return (
    <View style={styles.container}>
      <Text variant="displaySmall">{show.displayName}</Text>
      <View style={styles.selectionContainer}>
        <Text variant="titleLarge">Select a Time</Text>
        <View style={styles.selectionButtonsContainer}>
          {showtimes.map(showtime => {
            const isSelected = showtime.id === selectedShowtime?.id;
            return (
              <Button
                key={showtime.id}
                onPress={() => {
                  setSelectedShowtime(showtime);
                  setSelectedNumberOfTickets(NaN);
                }}
                mode={isSelected ? 'contained' : 'outlined'}
                contentStyle={styles.selectionButton}>
                {showtime.localTime}
              </Button>
            );
          })}
        </View>
      </View>
      {Boolean(numberOfTickets.length) && (
        <View style={styles.selectionContainer}>
          <Text variant="titleLarge">Number of Tickets</Text>
          <View style={styles.selectionButtonsContainer}>
            {numberOfTickets.map(number => {
              const isSelected = number === selectedNumberOfTickets;
              return (
                <Button
                  key={number}
                  onPress={() => setSelectedNumberOfTickets(number)}
                  mode={isSelected ? 'contained' : 'outlined'}
                  contentStyle={styles.selectionButton}>
                  {number}
                </Button>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

export default RushShowTicketSelection;

const styles = StyleSheet.create({
  container: {alignItems: 'center', rowGap: 30},
  selectionButton: {minWidth: 100, minHeight: 80},
  selectionButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 15,
    columnGap: 50,
    width: '100%'
  },
  selectionContainer: {alignItems: 'center', rowGap: 10}
});
