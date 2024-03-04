import React from "react";
import {Animated, StyleSheet, View} from "react-native";

import {DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {StackHeaderProps, createStackNavigator} from "@react-navigation/stack";
import {
  Icon,
  IconButton,
  MD3Theme,
  adaptNavigationTheme,
  useTheme
} from "react-native-paper";
import {useSafeAreaInsets} from "react-native-safe-area-context";

import RushShowList from "./RushShowList";
import EnterEmailScreen from "./authentication/EnterEmailScreen";
import EnterLinkScreen from "./authentication/EnterLinkScreen";

import ShowDetails from "../ShowDetails/ShowDetails";
import TodayTixLogoOnBackground from "../TodayTixLogoOnBackground";

import useGetAccessToken from "../../hooks/useGetAccessToken";
import useGetShows from "../../hooks/useGetShows";
import useGetShowtimesWithRushAvailability from "../../hooks/useGetShowtimesWithRushAvailability";
import {LIGHT_THEME} from "../../themes";
import {
  TodayTixFieldset,
  TodayTixLocation,
  TodayTixShow
} from "../../types/shows";
import {TodayTixShowtime} from "../../types/showtimes";

type ShowAndShowtimes = {
  show: TodayTixShow;
  showtimes: TodayTixShowtime[];
};

export type RootStack = {
  RushShowList: {
    showsAndTimes: ShowAndShowtimes[];
  };
  ShowDetails: ShowAndShowtimes;
  EnterEmail: undefined;
  EnterLink: undefined;
};
const Stack = createStackNavigator<RootStack>();

const {LightTheme: NAV_LIGHT_THEME} = adaptNavigationTheme({
  reactNavigationLight: DefaultTheme,
  materialLight: LIGHT_THEME
});

const HEADER_HEIGHT = 50;

const HeaderDot = ({
  isCircleFilled,
  color
}: {
  isCircleFilled: boolean;
  color: string;
}) => (
  <Icon
    source={
      isCircleFilled ? "checkbox-blank-circle" : "checkbox-blank-circle-outline"
    }
    color={color}
    size={20}
  />
);

const Header =
  ({colors}: MD3Theme, marginTop: number) =>
  ({route, navigation, back, progress}: StackHeaderProps) => {
    // cross-fade the header
    const opacity = Animated.add(
      progress.current,
      progress.next || 0
    ).interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, 1, 0]
    });

    return (
      <Animated.View
        style={[
          styles.headerContainer,
          {
            backgroundColor: colors.background,
            height: HEADER_HEIGHT,
            marginTop,
            opacity
          }
        ]}>
        <View style={styles.headerSideItem}>
          {back && (
            <IconButton
              accessibilityLabel="Go back"
              icon="arrow-left"
              size={35}
              onPress={navigation.goBack}
            />
          )}
        </View>
        <View style={styles.headerTitle}>
          <HeaderDot
            isCircleFilled={route.name === "EnterEmail"}
            color={colors.primary}
          />
          <HeaderDot
            isCircleFilled={route.name !== "EnterEmail"}
            color={colors.primary}
          />
        </View>
        {/* The extra view below is here to ensure the view above is centered */}
        <View style={styles.headerSideItem} />
      </Animated.View>
    );
  };

const RootNavigator = () => {
  const theme = useTheme();
  const {top} = useSafeAreaInsets();

  const {data: accessToken, isPending: isLoadingAccessToken} =
    useGetAccessToken();

  const {data: rushAndLotteryShows, isPending: isLoadingRushAndLotteryShows} =
    useGetShows({
      areAccessProgramsActive: true,
      fieldset: TodayTixFieldset.Summary,
      limit: 10000,
      location: TodayTixLocation.London
    });

  const rushShows = (rushAndLotteryShows ?? []).filter(
    show => show.isRushActive
  );

  const {data: rushShowtimes, isPending: isLoadingRushShowtimes} =
    useGetShowtimesWithRushAvailability({
      showIds: rushShows.map(show => show.id)
    });

  if (
    isLoadingAccessToken ||
    isLoadingRushAndLotteryShows ||
    isLoadingRushShowtimes
  )
    return <TodayTixLogoOnBackground />;

  return (
    <NavigationContainer theme={NAV_LIGHT_THEME}>
      <Stack.Navigator
        screenOptions={{
          header: Header(theme, top),
          headerMode: "float",
          headerStyle: {height: HEADER_HEIGHT}
        }}>
        {accessToken ? (
          <Stack.Group screenOptions={{headerShown: false}}>
            <Stack.Screen
              name="RushShowList"
              component={RushShowList}
              initialParams={{
                showsAndTimes: rushShows.map((show, i) => ({
                  show,
                  showtimes: rushShowtimes[i] ?? []
                }))
              }}
            />
            <Stack.Screen name="ShowDetails" component={ShowDetails} />
          </Stack.Group>
        ) : (
          <>
            <Stack.Screen name="EnterEmail" component={EnterEmailScreen} />
            <Stack.Screen name="EnterLink" component={EnterLinkScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: "4%"
  },
  headerSideItem: {flex: 1},
  headerTitle: {flexDirection: "row", gap: 20}
});
