import { router } from "expo-router";
import { Button, Image, StyleSheet, View } from "react-native";

export default function StartScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />
      <Button
        title="Login"
        color={"green"}
        onPress={() => router.push("./login")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: "100%",
    height: "50%",
    marginBottom: 30,
    resizeMode: "contain",
  },
  button: {
    backgroundColor: "green",
  },
});
