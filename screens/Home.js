import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Image, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../colors";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Button, Modal, TextInput } from "react-native-paper";

const Home = () => {
  const navigation = useNavigation();
  const [openModal, setOpenModal] = useState(true);
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.item} onPress={handleShowModal}>
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
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
        <Button style={styles.button} onPress={handleShowModal}>
          <Text style={{ color: "#fff" }}>Chat now!</Text>
        </Button>
      </Modal>
      <TouchableOpacity
        onPress={() => navigation.navigate("Chat")}
        style={styles.chatButton}
      >
        <Entypo name="chat" size={24} color={colors.lightGray} />
      </TouchableOpacity>
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
