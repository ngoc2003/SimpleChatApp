import { collection } from "firebase/firestore";
import { database } from "./firebase";

export const usersCollection = collection(database, "users");
export const chatsCollection = collection(database, "chats");
export const messagesCollection = collection(database, "messages");
