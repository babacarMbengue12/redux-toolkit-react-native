import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { Provider } from "react-redux";
import store from "./redux/store";
import Posts from "./screens/Posts";
export default function App() {
  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <Posts />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
