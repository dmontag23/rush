import React from "react";
import {Image, SafeAreaView, StyleSheet, View} from "react-native";

import {useTheme} from "react-native-paper";

const LOGO_URL = `${process.env.TODAY_TIX_WEB_URL}/static/ttx_logo_horizontal_white.png`;

const TodayTixLogoOnBackground = () => (
  <View style={{backgroundColor: useTheme().colors.primary}}>
    <SafeAreaView style={styles.logoContainer}>
      <Image
        accessibilityLabel="TodayTix logo"
        style={styles.logo}
        source={{uri: LOGO_URL}}
      />
    </SafeAreaView>
  </View>
);

export default TodayTixLogoOnBackground;

const styles = StyleSheet.create({
  logoContainer: {marginHorizontal: "10%"},
  logo: {width: "100%", height: "100%", resizeMode: "contain"}
});
