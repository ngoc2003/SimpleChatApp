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
import { auth } from "./config/firebase";
import { signOut } from "firebase/auth";
import Profile from "./screens/Profile";

import colors from "./colors";
import defaultAvatar from "./assets/avatarDefault.jpeg";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const AuthenticationUserContext = createContext({});
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
  const handleSignOut = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
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
        <Text style={styles.headerSideBarText}>
          {auth?.currentUser.displayName}
        </Text>
        <Text style={styles.headerSideBarText}>{auth.currentUser.email}</Text>
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() => handleSignOut()}
        >
          <AntDesign name="logout" size={24} color={colors.primary} />
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
    const unSubcribe = onAuthStateChanged(auth, async (authenticationUser) => {
      authenticationUser ? setUser(authenticationUser) : setUser(null);
      setLoading(false);
    });

    return () => unSubcribe();
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
    backgroundColor: colors.primary,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  signOutButton: {
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 9999,
    position: "absolute",
    top: 15,
    right: 15,
  },
  headerSideBarText: {
    color: "#fff",
    fontWeight: "600",
    paddingVertical: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 9999,
  },
});
