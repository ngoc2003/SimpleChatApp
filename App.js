import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Chat from "./screens/Chat";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import Home from "./screens/Home";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./config/firebase";
import Profile from "./screens/Profile";

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

const ChatStack = () => {
  return (
    <Stack.Navigator defaultScreenOptions={Home}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

const RootNavigator = () => {
  const [user, setUser] = useContext(AuthenticationUserContext);
  const [loading, setLoading] = useState(null);

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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
