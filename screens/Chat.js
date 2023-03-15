import React, {
  useState,
  useLayoutEffect,
  useCallback,
  useEffect,
  useContext,
  createContext,
} from "react";
import { GiftedChat, Send } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  where,
  orderBy,
  query,
  onSnapshot,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, database } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { messagesCollection } from "../config/collection";
import avatarDefault from "../assets/avatarDefault.jpeg";
import { Ionicons } from "@expo/vector-icons";
import colors from "../colors";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import { AuthenticationUserContext } from "../App";

function renderSend(props) {
  return (
    <Send {...props}>
      <View style={styles.sendingContainer}>
        <IconButton icon="send-circle" size={32} color={colors.primary} />
      </View>
    </Send>
  );
}

function renderLoading() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#6646ee" />
    </View>
  );
}

export default function Chat({ route }) {
  const { conversationId, displayName } = route.params;
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const [loading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    const q = query(
      messagesCollection,
      orderBy("createdAt", "desc"),
      where("conversationId", "==", conversationId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setIsLoading(false);
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
  }, [conversationId, displayName, messages]);

  useEffect(() => {
    navigation.setOptions({
      title: displayName.toUpperCase() ?? "",
      headerTitleAlign: "center",
      headerTintColor: colors.primary,
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginHorizontal: 10 }}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [displayName]);

  const handleSend = useCallback(
    (messages = []) => {
      setDoc(
        doc(database, "users", auth.currentUser.uid),
        {
          lastActive: serverTimestamp(),
        },
        { merge: true }
      );
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
    },
    [conversationId]
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
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
        listViewProps={{
          contentContainerStyle: { flexGrow: 1 },
        }}
        placeholder="Your message . . ."
        onPressAvatar={(user) =>
          navigation.navigate("Profile", { emailUser: user._id })
        }
        renderQuickReplySend={() => {
          return <Text>Xin chao</Text>;
        }}
        user={{
          _id: auth?.currentUser?.email,
          avatar: auth?.currentUser?.photoURL || avatarDefault,
        }}
        renderLoading={renderLoading}
        renderSend={renderSend}
        alwaysShowSend
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sendingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
