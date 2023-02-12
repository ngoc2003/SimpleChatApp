import { Image, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../../config/firebase";
import { onSnapshot, query, where } from "firebase/firestore";
import { usersCollection } from "../../../config/collection";

const ConversationItem = ({ users = [], conversationId }) => {
  const navigation = useNavigation();
  const handleNavigate = () => {
    navigation.navigate("Chat", { conversationId });
  };
  const userInformation = useRef(null);
  useEffect(() => {
    const index = users.findIndex((item) => item !== auth.currentUser.uid);
    const q = query(usersCollection, where("id", "==", users[index]));
    onSnapshot(q, (snapshot) => {
      console.log(snapshot.docs[0].data());
    });
  }, []);

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        paddingHorizontal: 10,
      }}
      onPress={handleNavigate}
    >
      <Image
        resizeMode="contain"
        source="https://i.pinimg.com/originals/58/2d/96/582d96a1df2d94bb439af1594639ccfe.jpg"
      />
      <Text style={{ marginHorizontal: 10 }}>{"Hi"}</Text>
    </TouchableOpacity>
  );
};

export default ConversationItem;
