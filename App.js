import "react-native-gesture-handler";
import { createContext, useContext, useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native";

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AntDesign } from "@expo/vector-icons";

import Chat from "./screens/Chat";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import Home from "./screens/Home";
import { auth, database } from "./config/firebase";
import { signOut } from "firebase/auth";
import Profile from "./screens/Profile";

import colors from "./colors";
import defaultAvatar from "./assets/avatarDefault.jpeg";
import { doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { usersCollection } from "./config/collection";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export const AuthenticationUserContext = createContext();
const AuthenticationProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticationUserContext.Provider value={[user, setUser]}>
      {children}
    </AuthenticationUserContext.Provider>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

function CustomDrawerContent(props) {
  const [user, setUser] = useContext(AuthenticationUserContext);

  const handleSignOut = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
    setUser(null);
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.headerSideBar}>
        <View>
          <Image
            resizeMode="cover"
            style={styles.avatar}
            source={defaultAvatar}
          />
        </View>
        <Text style={styles.headerSideBarText}>{user.displayName || ""}</Text>
        <Text style={styles.headerSideBarText}>{user.email || ""}</Text>
        <TouchableOpacity
          style={styles.yourProfile}
          onPress={() => alert("Go to your peofile")}
        >
          <Text style={styles.yourProfile.text}>View Your Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() => handleSignOut()}
        >
          <AntDesign name="logout" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text
        style={{
          fontSize: 12,
          color: colors.gray,
          fontWeight: "700",
          paddingVertical: 10,
          paddingHorizontal: 15,
        }}
      >
        Menu
      </Text>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const ChatStack = () => {
  return (
    <Drawer.Navigator
      defaultScreenOptions={Home}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: colors.primary,
        drawerContentStyle: "#fff",
        drawerActiveTintColor: "#fff",
      }}
    >
      <Drawer.Screen
        options={{
          drawerIcon: ({ focused }) => (
            <AntDesign
              name="home"
              size={24}
              color={focused ? "#fff" : "#000"}
            />
          ),
        }}
        name="Home"
        component={Home}
      />
      <Drawer.Screen
        name="Chat"
        component={Chat}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer.Navigator>
  );
};

const RootNavigator = () => {
  const [user, setUser] = useContext(AuthenticationUserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, async (authenticationUser) => {
      if (authenticationUser) {
        const uid = authenticationUser.uid;
        const q = query(usersCollection, where("id", "==", uid));
        onSnapshot(q, (snapshot) => {
          if (snapshot.docs[0].data()) {
            setUser(snapshot.docs[0].data());
          } else {
            setUser(null);
          }
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  console.log("USER ~~", user);

  return (
    <NavigationContainer>
      {user ? <ChatStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthenticationProvider>
      <RootNavigator />
    </AuthenticationProvider>
  );
}

const styles = StyleSheet.create({
  headerSideBar: {
    position: "relative",
    backgroundColor: "#fff",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  signOutButton: {
    backgroundColor: colors.primary,
    padding: 5,
    borderRadius: 9999,
    position: "absolute",
    top: 15,
    right: 15,
  },
  headerSideBarText: {
    color: "#333366",
    fontWeight: "500",
    paddingVertical: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 9999,
  },
  yourProfile: {
    text: {
      color: "#fff",
    },
    backgroundColor: colors.primary,
    marginVertical: 10,
    color: "#fff",
    padding: 8,
    borderRadius: 20,
  },
});
