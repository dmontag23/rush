import React, {useState} from "react";
import {Image, StyleSheet, View} from "react-native";

import {StackScreenProps} from "@react-navigation/stack";
import {ActivityIndicator, IconButton} from "react-native-paper";
import {useSafeAreaInsets} from "react-native-safe-area-context";

import RushShowTicketSelection from "./RushShowTicketSelection";

import {RootStack} from "../screens/RootNavigator";

const ShowDetails = ({
  route,
  navigation
}: StackScreenProps<RootStack, "ShowDetails">) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const {top} = useSafeAreaInsets();
  const {show, showtimes} = route.params;

  const headerImage = show.images?.productMedia.headerImage;

  return (
    <View style={styles.container}>
      <Image
        accessibilityLabel="Header image"
        source={{
          // TODO: Add a fallback image here
          uri: `https:${headerImage?.file.url ?? show.images?.productMedia.appHeroImage.file.url}`
        }}
        resizeMode={headerImage ? "cover" : "stretch"}
        onLoadEnd={() => setIsImageLoading(false)}
        style={styles.image}
      />
      {isImageLoading ? (
        <ActivityIndicator
          size="large"
          style={styles.loadingSpinner}
          testID="loadingHeaderImageSpinner"
        />
      ) : (
        <>
          <IconButton
            accessibilityLabel="Back button"
            icon="arrow-left"
            mode="contained-tonal"
            size={30}
            onPress={navigation.goBack}
            style={[styles.backButton, {marginTop: top}]}
          />
          <View style={styles.showDetailContainer}>
            <RushShowTicketSelection show={show} showtimes={showtimes} />
          </View>
        </>
      )}
    </View>
  );
};

export default ShowDetails;

const styles = StyleSheet.create({
  backButton: {position: "absolute", marginLeft: 15},
  container: {flex: 1},
  image: {height: 300},
  loadingSpinner: {position: "absolute", top: 0, bottom: 0, left: 0, right: 0},
  showDetailContainer: {flex: 1, paddingTop: 30}
});
