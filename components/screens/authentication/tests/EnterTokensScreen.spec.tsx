import React from "react";

import {describe, expect, it, jest} from "@jest/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {render, userEvent, waitFor} from "testing-library/extension";

import EnterTokensScreen from "../EnterTokensScreen";

import {RootStackParamList} from "../../../../types/navigation";

describe("EnterTokensScreen", () => {
  describe("integration tests", () => {
    it("displays elements in their initial state on the screen", () => {
      const Stack = createStackNavigator<RootStackParamList>();
      const {getByRole, getByText, getByLabelText} = render(
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="EnterTokens" component={EnterTokensScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );

      expect(getByText("Sign into TodayTix")).toBeVisible();
      expect(
        getByText("Enter the access tokens from the current TodayTix session.")
      ).toBeVisible();
      const accessTokenFormInput = getByLabelText("Access token input");
      expect(accessTokenFormInput).toBeVisible();
      expect(accessTokenFormInput).toHaveProp("value", "");
      const refreshTokenFormInput = getByLabelText("Refresh token input");
      expect(refreshTokenFormInput).toBeVisible();
      expect(refreshTokenFormInput).toHaveProp("value", "");
      const loginButton = getByRole("button", {name: "Login"});
      expect(loginButton).toBeVisible();
      expect(loginButton).toBeDisabled();
    });

    const dataSet = [
      {tokenType: "Access token", validationPrefix: "An access token"},
      {tokenType: "Refresh token", validationPrefix: "A refresh token"}
    ];
    it.each(dataSet)(
      "displays an $tokenType validation error",
      async ({tokenType, validationPrefix}) => {
        const Stack = createStackNavigator<RootStackParamList>();
        const {getByRole, getByText, getByLabelText} = render(
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="EnterTokens" component={EnterTokensScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        );

        // enter an invalid link
        userEvent.type(getByLabelText(`${tokenType} input`), "{Enter}");
        await waitFor(() =>
          expect(getByText(`${validationPrefix} is required`)).toBeVisible()
        );
        expect(getByRole("button", {name: "Login"})).toBeDisabled();
      }
    );

    it("displays an AsyncStorage error", async () => {
      // setup mock error response from async storage
      (
        AsyncStorage.multiSet as jest.MockedFunction<
          typeof AsyncStorage.multiSet
        >
      ).mockRejectedValueOnce("Error with AsyncStorage multiSet");

      const Stack = createStackNavigator<RootStackParamList>();
      const {getByRole, getByText, getByLabelText} = render(
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="EnterTokens" component={EnterTokensScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );

      // enter a valid access and refresh token
      userEvent.type(
        getByLabelText("Access token input"),
        "    access-token     "
      );
      userEvent.type(
        getByLabelText("Refresh token input"),
        "   refresh-token     "
      );
      const loginButton = getByRole("button", {name: "Login"});

      await waitFor(() => expect(loginButton).toBeEnabled());
      userEvent.press(loginButton);

      await waitFor(() =>
        expect(
          getByText(
            'An error occurred when trying to store the access token access-token, refresh token refresh-token, and ttl 0: "Error with AsyncStorage multiSet". Please try submitting the tokens again.'
          )
        ).toBeVisible()
      );
      expect(loginButton).toBeEnabled();
    });

    it("can login successfully", async () => {
      const Stack = createStackNavigator<RootStackParamList>();
      const {getByRole, getByLabelText} = render(
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="EnterTokens" component={EnterTokensScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );

      // check that async storage is initially empty
      expect(await AsyncStorage.getItem("access-token")).toBeNull();
      expect(await AsyncStorage.getItem("refresh-token")).toBeNull();
      expect(await AsyncStorage.getItem("token-ttl")).toBeNull();

      // enter a valid access and refresh token
      userEvent.type(getByLabelText("Access token input"), "access-token");
      userEvent.type(getByLabelText("Refresh token input"), "refresh-token");
      const loginButton = getByRole("button", {name: "Login"});
      await waitFor(() => expect(loginButton).toBeEnabled());
      userEvent.press(loginButton);

      // check that async storage contains the valid tokens
      await waitFor(async () =>
        expect(await AsyncStorage.getItem("access-token")).toBe("access-token")
      );
      expect(await AsyncStorage.getItem("refresh-token")).toBe("refresh-token");
      expect(await AsyncStorage.getItem("token-ttl")).toBe("0");
    });
  });

  describe("unit tests", () => {
    it("behavior is height on non-ios devices", async () => {
      jest.doMock("react-native/Libraries/Utilities/Platform", () => ({
        OS: "android",
        select: jest.fn
      }));

      const Stack = createStackNavigator();
      const {getByLabelText} = render(
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="test" component={EnterTokensScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );

      await waitFor(() =>
        expect(getByLabelText("Access token input")).toBeVisible()
      );
      jest.dontMock("react-native/Libraries/Utilities/Platform");
    });
  });
});
