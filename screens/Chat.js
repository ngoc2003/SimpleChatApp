import React, { useState, useLayoutEffect, useCallback } from "react";
import { TouchableOpacity, Text, Alert, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  where,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, database } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { chatsCollection, messagesCollection } from "../config/collection";

export default function Chat({ route }) {
  const { conversationId } = route.params;
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  const handleSignOut = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
          }}
          onPress={handleSignOut}
        >
          <AntDesign
            name="logout"
            size={24}
            color={colors.gray}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const q = query(
      messagesCollection,
      orderBy("createdAt", "desc"),
      where("conversationId", "==", conversationId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          conversationId,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });
    return unsubscribe;
  }, []);

  const handleSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(database, "messages"), {
      _id,
      conversationId,
      createdAt,
      text,
      user,
    });
  }, []);

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={false}
      showUserAvatar={false}
      onSend={(messages) => handleSend(messages)}
      messagesContainerStyle={{
        backgroundColor: "#fff",
      }}
      textInputStyle={{
        backgroundColor: "#fff",
        borderRadius: 20,
      }}
      placeholder="Your message . . ."
      onPressAvatar={(user) =>
        navigation.navigate("Profile", { emailUser: user._id })
      }
      user={{
        _id: auth?.currentUser?.email,
        avatar:
          auth?.currentUser?.photoURL ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuIGBpSqN8Z68NA-PZJjIYQNIAzJosw4YWig&usqp=CAU",
      }}
    />
  );
}
