import React, { useEffect, useState, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../colors";
import { AntDesign } from "@expo/vector-icons";
import { Button, Modal, TextInput } from "react-native-paper";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { auth, database } from "../config/firebase";
import { chatsCollection, usersCollection } from "../config/collection";
import ConversationList from "../components/conversationList";

const Home = () => {
  const navigation = useNavigation();
  const [openModal, setOpenModal] = useState(false);
  const [emailToChat, setEmailToChat] = useState("");

  const hadleChangeEmailToChat = (event) => {
    setEmailToChat(event);
  };

  const handleShowModal = () => setOpenModal(true);

  const handleHide = () => setOpenModal(false);

  useEffect(() => {
    navigation.setOptions({
      title: "HOME",
      headerTitleAlign: "center",
      headerTintColor: colors.primary,
    });
  }, [navigation]);
  const handleAddNewChat = () => {
    if (!emailToChat || emailToChat === auth.currentUser.email) {
      console.log("Create error!");
      return;
    }
    const q = query(usersCollection, where("email", "==", emailToChat));

    onSnapshot(q, (snapshot) => {
      if (snapshot.docs[0]) {
        const targetId = snapshot.docs[0].data().id;
        const isExist = query(
          chatsCollection,
          where("users", "in", [auth.currentUser.uid, targetId])
        );
        if (!isExist === false) {
          addDoc(collection(database, "chats"), {
            createdAt: serverTimestamp(),
            users: [auth.currentUser.uid, targetId],
          });
        }
        handleHide();
        handleFetchList();
      } else {
        console.log("Create error!");
      }
    });
  };

  const [listConversation, setListConversation] = useState();

  console.log(listConversation);

  const handleFetchList = useCallback(() => {
    const q = query(
      chatsCollection,
      where("users", "array-contains", auth.currentUser.uid)
    );
    onSnapshot(q, (querySnapshot) => {
      setListConversation(
        querySnapshot.docs.map((doc) => {
          return {
            conversationId: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt,
          };
        })
      );
    });
  }, []);

  useEffect(() => {
    handleFetchList();
  }, [handleFetchList]);

  return (
    <View style={styles.container}>
      <Modal
        visible={openModal}
        onDismiss={handleHide}
        contentContainerStyle={styles.modal}
      >
        <TextInput
          style={styles.input}
          label="Enter email to chat"
          mode="outlined"
          value={emailToChat}
          onChangeText={hadleChangeEmailToChat}
          autoFocus={false}
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <Button style={styles.button} onPress={handleAddNewChat}>
          <Text style={{ color: "#fff" }}>Chat now!</Text>
        </Button>
      </Modal>
      <TouchableOpacity
        onPress={() => {
          handleShowModal();
        }}
        style={styles.chatButton}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
      <ConversationList conversationList={listConversation} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 5,
  },
  input: { fontSize: 16, marginVertical: 10 },
  button: {
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  chatButton: {
    backgroundColor: colors.primary,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    marginRight: 20,
    marginBottom: 50,
    position: "absolute",
    right: 5,
    bottom: 5,
  },
  item: {
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  itemText: {
    color: "#fff",
    fontSize: 18,
  },
});
