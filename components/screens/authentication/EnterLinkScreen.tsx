import React, {useCallback} from 'react';
import {z} from 'zod';
import usePostCodeForAccessTokens from '../../../hooks/usePostCodeForAccessTokens';
import BaseAuthForm from '../../BaseAuthForm';
import {TodayTixAccessTokensRes} from '../../../types/loginTokens';
import useStoreAuthTokens from '../../../hooks/useStoreAuthTokens';

const VALIDATION_SCHEMA = z.object({
  code: z
    .string()
    .url('Please enter a valid url')
    .transform((link, ctx) => {
      const code = link.split('token=')[1];
      if (!code) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'A token was not found in the link. Please try pasting the link again.'
        });

        // This is a special symbol you can use to
        // return early from the transform function.
        // It has type `never` so it does not affect the
        // inferred return type.
        return z.NEVER;
      }
      return code;
    })
});

const EnterLinkScreen = () => {
  const {mutate: storeTokens, error} = useStoreAuthTokens();
  const handleExchangeCodeSuccess = useCallback(
    (data: TodayTixAccessTokensRes | undefined) => {
      if (data)
        storeTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          ttl: data.expiresIn * 1000 + new Date().getTime()
        });
    },
    [storeTokens]
  );

  return (
    <BaseAuthForm
      validationSchema={VALIDATION_SCHEMA}
      defaultValues={{code: ''}}
      fieldName="code"
      fieldLabel="Link"
      inputType="url"
      titleText="Almost there..."
      subText="Please enter the login link from the TodayTix email"
      submitButtonText="Login"
      mutationResult={usePostCodeForAccessTokens()}
      onMutationSuccess={handleExchangeCodeSuccess}
      additionalError={
        error &&
        `There was an error storing the authentication tokens: ${error.message}. Please try submitting the link again.`
      }
    />
  );
};

export default EnterLinkScreen;