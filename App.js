import "react-native-gesture-handler";
import { createContext, useContext, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native";

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Chat from "./screens/Chat";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import Home from "./screens/Home";
import { auth } from "./config/firebase";
import { signOut } from "firebase/auth";
import Profile from "./screens/Profile";

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
      <DrawerItemList {...props} />
      <DrawerItem label="Log out" onPress={() => handleSignOut()} />
    </DrawerContentScrollView>
  );
}

const ChatStack = () => {
  return (
    <Drawer.Navigator
      defaultScreenOptions={Home}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Chat" component={Chat} />
      <Drawer.Screen name="Profile" component={Profile} />
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
