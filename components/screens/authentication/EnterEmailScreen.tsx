import React from "react";
import {RootStack} from "../RootNavigator";
import {z} from "zod";
import usePostEmailForToken from "../../../hooks/usePostEmailForToken";
import BaseAuthForm from "../../BaseAuthForm";
import {StackScreenProps} from "@react-navigation/stack";

const VALIDATION_SCHEMA = z.object({
  emailAddress: z.string().trim().email("Please enter a valid email address")
});

const EnterEmailScreen = ({
  navigation
}: StackScreenProps<RootStack, "EnterEmail">) => {
  const onEmailSentSuccess = () => {
    navigation.navigate("EnterLink");
  };

  return (
    <BaseAuthForm
      validationSchema={VALIDATION_SCHEMA}
      defaultValues={{emailAddress: ""}}
      fieldName="emailAddress"
      fieldLabel="Email"
      inputType="email"
      titleText="Sign into TodayTix"
      subText="What's your email?"
      submitButtonText="Continue"
      mutationResult={usePostEmailForToken()}
      onMutationSuccess={onEmailSentSuccess}
    />
  );
};

export default EnterEmailScreen;
