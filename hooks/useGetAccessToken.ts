import AsyncStorage from "@react-native-async-storage/async-storage";
import {useQuery} from "@tanstack/react-query";

const getAccessToken = async () => await AsyncStorage.getItem("access-token");

const useGetAccessToken = () =>
  useQuery({
    queryKey: ["accessToken"],
    queryFn: getAccessToken
  });

export default useGetAccessToken;
