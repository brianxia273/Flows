import firebase from "../../firebase/clientApp";
import { GoogleAuthProvider } from "firebase/auth";

export const uiConfig = {
  signInSuccessUrl: "/", // Where to redirect after sign-in
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
};
