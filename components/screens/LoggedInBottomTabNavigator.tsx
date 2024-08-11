import React, {useState} from "react";
import {LayoutChangeEvent, View} from "react-native";

import {
  BottomTabBarProps,
  BottomTabNavigationOptions,
  createBottomTabNavigator
} from "@react-navigation/bottom-tabs";
import {CommonActions} from "@react-navigation/native";
import {BottomNavigation, Text} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import HoldConfirmationBottomSheet from "./HoldConfirmationBottomSheet";
import RushShowNavigator from "./RushShowNavigator";

import {LoggedInBottomTabParamList} from "../../types/navigation";
import {TodayTixShow} from "../../types/shows";

const BottomTab = createBottomTabNavigator<LoggedInBottomTabParamList>();

/* The bottom tab bar here is based on 
https://callstack.github.io/react-native-paper/docs/components/BottomNavigation/BottomNavigationBar/ */
const BottomTabBar = ({
  navigation,
  state,
  descriptors,
  insets
}: BottomTabBarProps) => (
  <BottomNavigation.Bar
    navigationState={state}
    safeAreaInsets={insets}
    onTabPress={({route, preventDefault}) => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true
      });

      event.defaultPrevented
        ? preventDefault()
        : navigation.dispatch({
            ...CommonActions.navigate(route.name, route.params),
            target: state.key
          });
    }}
    renderIcon={({route, focused, color}) => {
      const {options} = descriptors[route.key];
      if (options.tabBarIcon)
        return options.tabBarIcon({focused, color, size: 24});
    }}
    getLabelText={({route}) => {
      const {options} = descriptors[route.key];
      const tabBarLabel =
        typeof options.tabBarLabel === "string"
          ? options.tabBarLabel
          : undefined;
      return tabBarLabel ?? options.title ?? route.name;
    }}
  />
);

const BottomTabBarWrapper = (
  props: BottomTabBarProps,
  handleLayout: (event: LayoutChangeEvent) => void
) => (
  <View onLayout={handleLayout} testID="bottomTabBarWrapper">
    <BottomTabBar {...props} />
  </View>
);

const CreateTabBarIcon =
  (name: (typeof Icon)["name"]): BottomTabNavigationOptions["tabBarIcon"] =>
  ({color, size}) => <Icon name={name} size={size} color={color} />;

const SettingsRoute = () => <Text>Settings</Text>;

type LoggedInBottomTabNavigatorProps = {
  shows: TodayTixShow[];
};

const LoggedInBottomTabNavigator = ({
  shows
}: LoggedInBottomTabNavigatorProps) => {
  const [bottomNavBarHeight, setBottomNavBarHeight] = useState<number>();

  const rushShows = shows.filter(show => show.isRushActive);

  const handleLayout = (event: LayoutChangeEvent) => {
    const {height} = event.nativeEvent.layout;
    setBottomNavBarHeight(height);
  };

  return (
    <>
      {/* The tab navigator is used instead of the BottomNavigation from react-native-paper because
      the height of the bottom navigation bar is needed to place the hold confirmation bottom sheet
      properly, and it does not seem there is a way to get this height from the BottomNavigation component. */}
      <BottomTab.Navigator
        screenOptions={{
          headerShown: false
        }}
        tabBar={props => BottomTabBarWrapper(props, handleLayout)}>
        <BottomTab.Screen
          name="RushShows"
          component={RushShowNavigator}
          initialParams={{rushShows}}
          options={{
            tabBarLabel: "Rush Shows",
            tabBarIcon: CreateTabBarIcon("drama-masks")
          }}
        />
        <BottomTab.Screen
          name="Settings"
          component={SettingsRoute}
          options={{
            tabBarLabel: "Settings",
            tabBarIcon: CreateTabBarIcon("cog")
          }}
        />
      </BottomTab.Navigator>
      {bottomNavBarHeight && (
        <HoldConfirmationBottomSheet bottomInset={bottomNavBarHeight} />
      )}
    </>
  );
};

export default LoggedInBottomTabNavigator;
