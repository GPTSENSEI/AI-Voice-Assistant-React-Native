import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ListItem, Avatar } from "@rneui/base";
const CustomListItem = ({ id, chatName, enterChat }) => {
  return (
    <ListItem>
      <Avatar
        rounded
        source={{
          uri: "https://www.seekpng.com/png/detail/73-730482_existing-user-default-avatar.png",
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "800" }}>GPT chat</ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          test Subtitle test Subtitle test Subtitle test Subtitle test Subtitle
          test Subtitle test Subtitle test Subtitle test Subtitle
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItem;

const styles = StyleSheet.create({});
