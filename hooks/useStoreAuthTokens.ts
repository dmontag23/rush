import {useMutation, useQueryClient} from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

const storeTokens = async (tokens: {
  accessToken: string;
  refreshToken: string;
  ttl: number;
}) => {
  // TODO: Use secure storage for tokens instead
  await AsyncStorage.multiSet([
    ["access-token", tokens.accessToken],
    ["refresh-token", tokens.refreshToken],
    ["token-ttl", tokens.ttl.toString()]
  ]);
  return tokens;
};

const useStoreAuthTokens = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeTokens,
    // Always refetch the access token after success or error
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["accessToken"]
      });
    }
  });
};

export default useStoreAuthTokens;
