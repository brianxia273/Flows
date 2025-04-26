import { auth, firestore } from "../../firebase/clientApp";
import { GoogleAuthProvider } from "firebase/auth";

export const uiConfig = {
  signInSuccessUrl: "/", // Where to redirect after sign-in
  signInOptions: [GoogleAuthProvider.PROVIDER_ID],
};
