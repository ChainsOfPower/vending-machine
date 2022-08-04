import React, { useState } from "react";
import { UserRole } from "../api-types/api-types";
import jwt from "jwt-decode";

export type JwtPayload = {
  id: number;
  role: UserRole;
}

export type AuthContextType = {
  jwtPayload: JwtPayload | null;
  isLoggedIn: boolean;
  logIn: (token: string, refreshToken: string) => void;
  logOut: () => void;
  isBuyer: boolean;
  isSeller: boolean;
};

const AuthContext = React.createContext<AuthContextType>({
  jwtPayload: null,
  isLoggedIn: false,
  logIn: (token: string, refreshToken: string) => {},
  logOut: () => {},
  isBuyer: false,
  isSeller: false,
});

interface Props {
  children: React.ReactNode;
}

export const AuthContextProvider: React.FC<Props> = ({ children }) => {
  const initialToken = localStorage.getItem("token");

  const initialJwtPayload = initialToken 
    ? jwt<JwtPayload>(initialToken) 
    : null;

  const [jwtPayload, setJwtPayload] = useState<JwtPayload | null>(initialJwtPayload);

  const logInHanlder = (token: string, refreshToken: string) => {
    setJwtPayload(jwt(token));
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const logOutHandler = () => {
    setJwtPayload(null);
    localStorage.removeItem("token");
  };

  const isUserLoggedIn = !!jwtPayload;
  const isBuyer = jwtPayload?.role === UserRole.BUYER;
  const isSeller = jwtPayload?.role === UserRole.SELLER;

  const contextValue: AuthContextType = {
    jwtPayload,
    isLoggedIn: isUserLoggedIn,
    logIn: logInHanlder,
    logOut: logOutHandler,
    isBuyer,
    isSeller
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
