import React from "react";

import {describe, expect, it, jest} from "@jest/globals";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {useMutation} from "@tanstack/react-query";
import {render, renderHook, waitFor} from "testing-library/extension";
import {z} from "zod";

import BaseAuthForm from "../BaseAuthForm";

import {TodayTixAPIError} from "../../types/base";

describe("BaseAuthForm unit tests", () => {
  it("calls the no-op onMutationSuccess function if not passed in", async () => {
    const {
      result: {current: mutationHookResult}
    } = renderHook(() => useMutation<unknown, TodayTixAPIError>({}));

    const Stack = createStackNavigator();
    const {getByText} = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="test">
            {() => (
              <BaseAuthForm
                validationSchema={z.any()}
                defaultValues={undefined}
                fieldName=""
                fieldLabel=""
                inputType="tel"
                titleText="Title text"
                subText=""
                submitButtonText=""
                mutationResult={{
                  ...mutationHookResult,
                  isSuccess: true,
                  isIdle: false,
                  status: "success",
                  isPending: false,
                  isError: false,
                  error: null,
                  data: true
                }}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => expect(getByText("Title text")).toBeVisible());
  });

  it("behavior is height on non-ios devices", async () => {
    jest.doMock("react-native/Libraries/Utilities/Platform", () => ({
      OS: "android",
      select: jest.fn
    }));

    const {
      result: {current: mutationHookResult}
    } = renderHook(() => useMutation<unknown, TodayTixAPIError>({}));

    const Stack = createStackNavigator();
    const {getByLabelText} = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="test">
            {() => (
              <BaseAuthForm
                validationSchema={z.any()}
                defaultValues={undefined}
                fieldName=""
                fieldLabel=""
                inputType="tel"
                titleText=""
                subText=""
                submitButtonText=""
                mutationResult={mutationHookResult}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => expect(getByLabelText("Form")).toBeVisible());
    jest.dontMock("react-native/Libraries/Utilities/Platform");
  });
});
