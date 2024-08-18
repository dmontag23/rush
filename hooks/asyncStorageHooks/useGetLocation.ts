import AsyncStorage from "@react-native-async-storage/async-storage";
import {useQuery} from "@tanstack/react-query";

import {TodayTixLocation} from "../../types/shows";

// Set the default location to London
const getLocation = async () =>
  Number((await AsyncStorage.getItem("location")) ?? TodayTixLocation.London);

const useGetLocation = () =>
  useQuery({
    queryKey: ["location"],
    queryFn: getLocation
  });

export default useGetLocation;
