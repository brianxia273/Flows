"use client";

import { createContext, useContext, ReactNode, FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import { User } from "firebase/auth";

type AuthData = {
  user?: User | null;
  loading: boolean;
  error?: Error;
};

const AuthUserContext = createContext<AuthData | undefined>(undefined);

export const AuthUserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <AuthUserContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthUserContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthUserContext);
  if (!context) throw new Error("useAuth must be used within AuthUserProvider");
  return context;
};
