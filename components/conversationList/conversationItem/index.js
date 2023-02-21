import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../../../config/firebase";
import { onSnapshot, query, where } from "firebase/firestore";
import { usersCollection } from "../../../config/collection";
import { useNavigation } from "@react-navigation/native";
import avatarDefault from "../../../assets/avatarDefault.jpeg";

const ConversationItem = ({ users = [], conversationId }) => {
  const navigation = useNavigation();
  const [userInformation, setUserInformation] = useState({});
  const handleNavigate = () => {
    navigation.navigate("Chat", {
      conversationId,
      displayName: userInformation.displayName,
    });
  };

  useEffect(() => {
    const index = users.findIndex((item) => item !== auth.currentUser.uid);
    const q = query(usersCollection, where("id", "==", users[index]));
    onSnapshot(q, (snapshot) => {
      setUserInformation(snapshot.docs[0].data());
    });
  }, []);

  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigate}>
      <Image style={styles.image} resizeMode="cover" source={avatarDefault} />
      <Text style={{ marginHorizontal: 10 }}>
        {userInformation?.displayName || ""}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
    border: "1px solid #ccc",
  },
  image: {
    width: 50,
    height: 50,
  },
});

export default ConversationItem;
