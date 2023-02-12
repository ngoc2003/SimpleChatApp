import { View, Text } from "react-native";
import React from "react";
import ConversationItem from "./conversationItem";

const ConversationList = ({ conversationList = [] }) => {
  if (!conversationList.length) {
    return (
      <View>
        <Text>Empty</Text>
      </View>
    );
  }
  return (
    <View>
      {conversationList.map(({ users, conversationId }) => (
        <ConversationItem
          key={conversationId}
          conversationId={conversationId}
          users={users}
        />
      ))}
    </View>
  );
};

export default ConversationList;
