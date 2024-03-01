/* TODO: Maybe find a better way to do this? Testing the login functionality
for every test isn't great. Something like a deep link may work better, but
has other disadvantages. Perhaps exposing a way to do this from the mock server somehow
would be best? */
export const login = async () => {
  const emailFormInput = element(by.label('Email')).atIndex(1);
  await waitFor(emailFormInput).toBeVisible().withTimeout(10000);
  await element(by.label('Email')).atIndex(1).typeText('good@gmail.com');
  await element(by.text('Continue')).tap();
  await element(by.label('Link'))
    .atIndex(1)
    .typeText('https://todaytix.com?token=good-code');
  await element(by.text('Login')).tap();
};
