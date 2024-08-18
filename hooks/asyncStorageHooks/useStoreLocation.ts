import AsyncStorage from "@react-native-async-storage/async-storage";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import {TodayTixLocation} from "../../types/shows";

const storeLocation = async (location: TodayTixLocation) => {
  await AsyncStorage.setItem("location", location.toString());
  return location;
};

const useStoreLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeLocation,
    // Always refetch the location after success or error
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["location"]
      });
    }
  });
};

export default useStoreLocation;
