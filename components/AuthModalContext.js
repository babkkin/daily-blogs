"use client";
import { createContext, useContext, useState } from "react";

const AuthModalContext = createContext();

export function AuthModalProvider({ children }) {
  const [showAuth, setShowAuth] = useState(false);
  const [authType, setAuthType] = useState("login");

  const openModal = (type) => {
    setAuthType(type);
    setShowAuth(true);
  };

  const closeModal = () => setShowAuth(false);

  return (
    <AuthModalContext.Provider value={{ showAuth, authType, openModal, closeModal }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
