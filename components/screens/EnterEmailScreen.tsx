import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Text,
  TextInput,
  useTheme
} from 'react-native-paper';
import {RootStack} from './RootNavigator';
import config from '../../config.json';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import usePostEmailForToken from '../../hooks/usePostEmailForToken';
import {useFocusEffect} from '@react-navigation/native';

const ErrorText = ({message}: {message: string}) => (
  <Text variant="titleMedium" style={{color: useTheme().colors.error}}>
    {message}
  </Text>
);

const VALIDATION_SCHEMA = z.object({
  emailAddress: z.string().trim().email('Please enter a valid email address')
});
type ValidationSchema = z.infer<typeof VALIDATION_SCHEMA>;

const EnterEmailScreen = ({
  navigation
}: NativeStackScreenProps<RootStack, 'EnterEmail'>) => {
  const theme = useTheme();
  const {
    mutate: sendEmail,
    isPending: isSendingEmail,
    isSuccess: isEmailSentSuccess,
    isError: isEmailSentError,
    error: emailError,
    reset: resetSendEmail
  } = usePostEmailForToken();

  const {
    control,
    handleSubmit,
    formState: {errors: formErrors, isValid: isFormValid}
  } = useForm<ValidationSchema>({
    defaultValues: {emailAddress: ''},
    mode: 'onTouched',
    resolver: zodResolver(VALIDATION_SCHEMA)
  });

  const onSubmit: SubmitHandler<ValidationSchema> = ({emailAddress}) => {
    if (!isSendingEmail || isEmailSentSuccess) sendEmail(emailAddress);
  };

  useFocusEffect(
    useCallback(() => {
      resetSendEmail();
    }, [resetSendEmail])
  );

  useEffect(() => {
    if (isEmailSentSuccess) navigation.navigate('EnterLink');
  }, [isEmailSentSuccess, navigation]);

  return (
    <View style={styles.screenContainer}>
      <Text variant="displayMedium" style={styles.title}>
        Enter your email address
      </Text>
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              label="Email"
              mode="outlined"
              error={Boolean(formErrors.emailAddress)}
              autoCapitalize="none"
              autoComplete="email"
              autoFocus
              inputMode="email"
              value={value}
              onChangeText={newText => {
                resetSendEmail();
                onChange(newText);
              }}
              onBlur={onBlur}
              style={styles.input}
            />
          )}
          name="emailAddress"
        />
        {formErrors.emailAddress && (
          <ErrorText
            message={
              formErrors.emailAddress.message ?? formErrors.emailAddress.type
            }
          />
        )}
        {isEmailSentError && (
          <>
            <ErrorText message="TodayTix returned the following error:" />
            <ErrorText message={emailError.message ?? emailError.error} />
          </>
        )}
        <Button
          mode="contained"
          disabled={!isFormValid}
          onPress={handleSubmit(onSubmit)}
          theme={{roundness: 0}}>
          {/* The isEmailSentSuccess condition below is to keep the continuity of the loading spinner during the
          transition to the next screen. Otherwise, the text on the button changes back to "Continue" before the user
          has finished the transition */}
          {isSendingEmail || isEmailSentSuccess ? (
            <ActivityIndicator color={theme.colors.onPrimary} />
          ) : (
            <Text variant="titleLarge" style={{color: theme.colors.onPrimary}}>
              Continue
            </Text>
          )}
        </Button>
        <View style={styles.footerTextContainer}>
          <Text variant="titleMedium">Sign up with TodayTix </Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(config.todayTixBaseUrl);
            }}>
            <Text variant="titleMedium" style={{color: theme.colors.primary}}>
              here
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EnterEmailScreen;

const styles = StyleSheet.create({
  footerTextContainer: {flexDirection: 'row'},
  input: {height: 80, lineHeight: 29, fontSize: 24},
  inputContainer: {gap: 10},
  screenContainer: {
    marginTop: '10%',
    marginHorizontal: '8%',
    rowGap: 60
  },
  title: {fontWeight: 'bold'}
});
