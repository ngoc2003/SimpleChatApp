import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, database } from "../config/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const Profile = ({ route, navigation }) => {
  const { emailUser } = route?.params || auth?.currentUser?.uid || null;
  const [user, setUser] = useState();
  useEffect(() => {
    if (emailUser) {
      const collectionRef = collection(database, "users");
      const q = query(collectionRef, where("E-mail", "==", emailUser));

      const unsubscribe = onSnapshot(q, (snapshoot) => {
        setUser(snapshoot.docs[0]);
      });
      return unsubscribe;
    }
  }, [emailUser]);

  return (
    <View>
      <Text>{emailUser ?? "EMPTY"}</Text>
    </View>
  );
};

export default Profile;
