import React, {
  useState,
  useLayoutEffect,
  useCallback,
  useEffect,
} from "react";
import { GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  where,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { auth, database } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { messagesCollection } from "../config/collection";
import avatarDefault from "../assets/avatarDefault.jpeg";

export default function Chat({ route }) {
  const { conversationId } = route.params;
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

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
        avatar: auth?.currentUser?.photoURL || avatarDefault,
      }}
    />
  );
}
