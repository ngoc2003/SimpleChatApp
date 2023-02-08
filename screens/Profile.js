import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { database } from "../config/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const Profile = ({ route, navigation }) => {
  const { emailUser } = route.params;
  const [user, setUser] = useState();
  useEffect(() => {
    const collectionRef = collection(database, "users");
    const q = query(collectionRef, where("E-mail", "==", emailUser));

    const unsubscribe = onSnapshot(q, (snapshoot) => {
      setUser(snapshoot.docs[0]);
    });
    return unsubscribe;
  }, []);

  console.log(user);
  return (
    <View>
      <Text>{emailUser}</Text>
    </View>
  );
};

export default Profile;
