import {useEffect} from "react";

import useGetAuthTokens from "./asyncStorageHooks/useGetAuthTokens";
import useGetCustomerIdFromAsyncStorage from "./asyncStorageHooks/useGetCustomerIdFromAsyncStorage";
import useStoreCustomerId from "./asyncStorageHooks/useStoreCustomerId";
import useGetCustomersMe from "./todayTixHooks/useGetCustomersMe";

const useGetCustomerId = () => {
  const {data: authTokens, isPending: isGetAuthTokensPending} =
    useGetAuthTokens();

  const {
    data: customerIdFromAsyncStorage,
    isPending: isGetCustomerIdFromAsyncStoragePending,
    isSuccess: isGetCustomerIdFromAsyncStorageSuccess
  } = useGetCustomerIdFromAsyncStorage();

  const shouldFetchCustomerFromTodayTixAPI =
    Boolean(authTokens?.accessToken && authTokens.refreshToken) &&
    isGetCustomerIdFromAsyncStorageSuccess &&
    !customerIdFromAsyncStorage;

  const {
    data: customerFromTodayTix,
    isPending: isGetCustomerFromTodayTixPending,
    isSuccess: isGetCustomerFromTodayTixSuccess
  } = useGetCustomersMe({
    enabled: shouldFetchCustomerFromTodayTixAPI
  });

  const {
    mutate: storeCustomerIdInAsyncStorage,
    isPending: isStoreCustomerIdInAsyncStoragePending
  } = useStoreCustomerId();

  /* TODO: Note that there is a brief period where isPending for the whole hook will be false but the whole
  hook is technically still loading because it needs to store the customer ID from the TodayTix Customer API endpoint, 
  but the mutation function in this useEffect call hasn't been triggered yet. Come back to handle this in a clever
  way so the hook always returns the right pending state */
  useEffect(() => {
    if (isGetCustomerFromTodayTixSuccess)
      storeCustomerIdInAsyncStorage(customerFromTodayTix.id);
  }, [
    customerFromTodayTix,
    isGetCustomerFromTodayTixSuccess,
    storeCustomerIdInAsyncStorage
  ]);

  return {
    customerId: customerIdFromAsyncStorage ?? customerFromTodayTix?.id,
    isPending:
      isGetAuthTokensPending ||
      isGetCustomerIdFromAsyncStoragePending ||
      (shouldFetchCustomerFromTodayTixAPI &&
        isGetCustomerFromTodayTixPending) ||
      isStoreCustomerIdInAsyncStoragePending,
    isSuccess: shouldFetchCustomerFromTodayTixAPI
      ? isGetCustomerFromTodayTixSuccess
      : isGetCustomerIdFromAsyncStorageSuccess
  };
};

export default useGetCustomerId;
