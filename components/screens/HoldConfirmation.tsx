import React, {useContext} from "react";
import {Linking, SafeAreaView, StyleSheet, View} from "react-native";

import {useNavigation} from "@react-navigation/native";
import {Button, Card, IconButton, Text} from "react-native-paper";

import {pluralize} from "../utils";

import HoldContext from "../../store/hold-context";

const HoldConfirmation = () => {
  const {goBack} = useNavigation();
  const {hold} = useContext(HoldContext);

  const todayTixURL = process.env.TODAY_TIX_APP_URL;

  return (
    <SafeAreaView style={styles.pageContainer}>
      {/* TODO: Maybe refactor back button into UI component? */}
      <IconButton
        accessibilityLabel="Back button"
        icon="arrow-left"
        mode="contained-tonal"
        size={30}
        onPress={goBack}
      />
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text variant="displayLarge">🎉</Text>
          <Text variant="headlineLarge">Congratulations!</Text>
          <Text variant="titleMedium">{`You've won ${hold?.numSeats} ticket${pluralize(hold?.numSeats)} to ${hold?.showtime.show?.displayName}.`}</Text>
        </View>
        <Card>
          <Card.Content style={styles.cardContainer}>
            <View>
              <Text variant="titleMedium">Seats</Text>
              <Text>{hold?.seatsInfo?.sectionName}</Text>
              <Text>{`Row ${hold?.seatsInfo?.row}, Seat${pluralize(hold?.numSeats)} ${hold?.seatsInfo?.seats.join(" and ")}`}</Text>
            </View>
            <View style={styles.rightCardContent}>
              <Text variant="titleMedium">Order Total</Text>
              <Text>{hold?.configurableTexts?.amountDisplayForWeb}</Text>
            </View>
          </Card.Content>
        </Card>
        <Text style={styles.warningText}>
          IMPORTANT: Hard-close the TodayTix app before pressing the Purchase
          button!
        </Text>
        {todayTixURL && (
          <Button mode="contained" onPress={() => Linking.openURL(todayTixURL)}>
            Purchase on TodayTix
          </Button>
        )}
        <Button mode="outlined">Release tickets</Button>
      </View>
    </SafeAreaView>
  );
};

export default HoldConfirmation;

const styles = StyleSheet.create({
  cardContainer: {flexDirection: "row", justifyContent: "space-between"},
  contentContainer: {rowGap: 20},
  headerContainer: {alignItems: "center", rowGap: 10},
  pageContainer: {marginHorizontal: 15},
  rightCardContent: {alignItems: "flex-end"},
  warningText: {fontWeight: "bold"}
});
