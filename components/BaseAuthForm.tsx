import {UseMutationResult} from '@tanstack/react-query';
import React, {useCallback, useEffect} from 'react';
import {
  ActivityIndicator,
  Button,
  Text,
  TextInput,
  useTheme
} from 'react-native-paper';
import {zodResolver} from '@hookform/resolvers/zod';
import {
  Controller,
  DefaultValues,
  FieldPath,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import {z} from 'zod';
import {useFocusEffect} from '@react-navigation/native';
import {
  InputModeOptions,
  StyleSheet,
  View,
  TextInputProps,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import {TodayTixAPIError} from '../types/base';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useHeaderHeight} from '@react-navigation/elements';

const ErrorText = ({message}: {message: string}) => (
  <Text variant="titleMedium" style={{color: useTheme().colors.error}}>
    {message}
  </Text>
);

type BaseAuthFormProps<TField extends FieldValues, TData, TVariables> = {
  validationSchema: z.Schema<TField>;
  defaultValues: DefaultValues<TField>;
  fieldName: FieldPath<TField>;
  fieldLabel: string;
  inputType: InputModeOptions & TextInputProps['autoComplete'];
  titleText: string;
  subText: string;
  submitButtonText: string;
  mutationResult: UseMutationResult<TData, TodayTixAPIError, TVariables>;
  onMutationSuccess?: (data: TData) => void;
  additionalError?: string | null;
};

const BaseAuthForm = <TField extends FieldValues, TData, TVariables>({
  validationSchema,
  defaultValues,
  fieldName,
  fieldLabel,
  inputType,
  titleText,
  subText,
  submitButtonText,
  mutationResult: {
    mutate,
    data: mutationData,
    isPending: isMutationPending,
    isSuccess: isMutationSuccess,
    isError: isMutationError,
    error: mutationError,
    reset: resetMutation
  },
  onMutationSuccess = () => {},
  additionalError
}: BaseAuthFormProps<TField, TData, TVariables>) => {
  const {colors} = useTheme();

  const {
    control,
    handleSubmit,
    formState: {errors: formErrors, isValid: isFormValid},
    reset: resetForm
  } = useForm({
    defaultValues,
    mode: 'onTouched',
    resolver: zodResolver(validationSchema)
  });

  const onSubmit: SubmitHandler<FieldValues> = formFields => {
    if (!(isMutationPending || isMutationSuccess))
      mutate(formFields[fieldName]);
  };

  useFocusEffect(
    useCallback(() => {
      resetForm();
      resetMutation();
    }, [resetForm, resetMutation])
  );

  useEffect(() => {
    if (isMutationSuccess && mutationData) onMutationSuccess(mutationData);
  }, [isMutationSuccess, mutationData, onMutationSuccess]);

  useEffect(() => {
    if (additionalError) resetMutation();
  }, [additionalError, resetMutation]);

  const {top, bottom} = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      /* The top is needed below because the header has a top margin
      equal to the top safe area */
      keyboardVerticalOffset={useHeaderHeight() + top + 15}
      style={[styles.screenContainer, {marginBottom: bottom}]}>
      <View style={styles.formContainer}>
        <View style={styles.formTextContainer}>
          <Text variant="headlineLarge" style={styles.title}>
            {titleText}
          </Text>
          <Text variant="titleLarge" style={{color: colors.onSurfaceVariant}}>
            {subText}
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                label={fieldLabel}
                accessibilityLabel={fieldLabel}
                mode="outlined"
                error={Boolean(formErrors[fieldName])}
                autoCapitalize="none"
                autoComplete={inputType}
                inputMode={inputType}
                value={value}
                onChangeText={newText => {
                  resetMutation();
                  onChange(newText);
                }}
                onBlur={onBlur}
                style={styles.input}
              />
            )}
            name={fieldName}
          />
          {formErrors[fieldName] && (
            <ErrorText
              message={
                formErrors[fieldName]?.message?.toString() ??
                (formErrors[fieldName]?.type ?? {}).toString()
              }
            />
          )}
          {isMutationError && (
            <>
              <ErrorText message="TodayTix returned the following error:" />
              <ErrorText
                message={mutationError?.message ?? mutationError?.error ?? ''}
              />
            </>
          )}
          {additionalError && <ErrorText message={additionalError} />}
        </View>
      </View>
      <Button
        mode="contained"
        disabled={!isFormValid}
        onPress={handleSubmit(onSubmit)}
        theme={{roundness: 1}}>
        {/* The isSuccess condition below is to keep the continuity of the loading spinner during the
          transition to the next screen. Otherwise, the text on the button changes back to its text before the user
          has finished the transition */}
        {isMutationPending || isMutationSuccess ? (
          <ActivityIndicator color={colors.onPrimary} />
        ) : (
          <Text variant="titleLarge" style={{color: colors.onPrimary}}>
            {submitButtonText}
          </Text>
        )}
      </Button>
    </KeyboardAvoidingView>
  );
};

export default BaseAuthForm;

const styles = StyleSheet.create({
  formContainer: {gap: 60},
  formTextContainer: {gap: 15},
  inputContainer: {gap: 10},
  input: {height: 60, lineHeight: 20},
  screenContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: '10%',
    marginHorizontal: '8%'
  },
  title: {fontWeight: 'bold'}
});
