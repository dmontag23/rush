/* TODO: Maybe find a better way to do this? Testing the login functionality
for every test isn't great. Something like a deep link may work better, but
has other disadvantages. Perhaps exposing a way to do this from the mock server somehow
would be best? */
export const login = async () => {
  const accessTokenFormInput = element(by.label("Access token input")).atIndex(
    1
  );
  await waitFor(accessTokenFormInput).toBeVisible().withTimeout(10000);
  await accessTokenFormInput.typeText("access-token");
  await element(by.label("Refresh token input"))
    .atIndex(1)
    .typeText("refresh-token");
  await element(by.text("Login")).tap();
};
