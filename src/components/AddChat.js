import React, { useLayoutEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import CustomMenu from "./CustomMenu";
import { Avatar } from "@rneui/base";
import { auth } from "../../firebase";
import { Input } from "@rneui/themed";

const AddChat = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={styles.title}>Conversation</Text>,
      headerStyle: { backgroundColor: "#fff" },
      headerTintColor: "black",
      headerBackTitle: "Chats",
      headerRight: () => <CustomMenu navigation={navigation} />,
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Input placeholder=" a chat" />
    </View>
  );
};

export default AddChat;

const styles = StyleSheet.create({});
