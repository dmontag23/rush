import React from "react";

import {createStackNavigator} from "@react-navigation/stack";

import RushShowListScreen from "./RushShowListScreen";

import ShowDetailsScreen from "../ShowDetails/ShowDetailsScreen";

import {
  LoggedInBottomTabScreenProps,
  RushShowStackParamList
} from "../../types/navigation";

const Stack = createStackNavigator<RushShowStackParamList>();

const RushShowNavigator = ({
  route
}: LoggedInBottomTabScreenProps<"RushShows">) => {
  const {rushShows} = route.params;

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="RushShowList"
        component={RushShowListScreen}
        initialParams={{rushShows}}
      />
      <Stack.Screen name="ShowDetails" component={ShowDetailsScreen} />
    </Stack.Navigator>
  );
};

export default RushShowNavigator;
