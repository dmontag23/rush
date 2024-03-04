/* react-native-gesture-handler needs to be the first import
See https://reactnavigation.org/docs/stack-navigator/ */
// eslint-disable-next-line prettier/prettier
import "react-native-gesture-handler";
// eslint-disable-next-line prettier/prettier
import {AppRegistry} from "react-native";

import App from "./App";
import {name as appName} from "./app.json";

AppRegistry.registerComponent(appName, () => App);
