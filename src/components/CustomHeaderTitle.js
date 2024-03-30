import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CustomHeaderTitle = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GPT sensei</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddChat")}
      >
        <Ionicons name="add" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default CustomHeaderTitle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    // justifyContent: "center",
    alignItems: "center",
    marginLeft: 100,
    // marginLeft: "auto",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  addButton: {
    marginTop: 5,
  },
});
