import React, { useState } from "react";

export type AuthContextType = {
  //TODO: replace accessToken with JwtPayload
  accessToken: string | null;
  isLoggedIn: boolean;
  logIn: (token: string) => void;
  logOut: () => void;
};

const AuthContext = React.createContext<AuthContextType>({
  accessToken: "",
  isLoggedIn: false,
  logIn: (token: string) => {},
  logOut: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const AuthContextProvider: React.FC<Props> = ({ children }) => {
  const initialToken = localStorage.getItem("token");
  const [accessToken, setAccessToken] = useState<string | null>(initialToken);

  const isUserLoggedIn = !!accessToken;

  const logInHanlder = (token: string) => {
    setAccessToken(token);
    localStorage.setItem("token", token);
  };

  const logOutHandler = () => {
    setAccessToken("");
    localStorage.removeItem("token");
  };

  const contextValue: AuthContextType = {
    accessToken,
    isLoggedIn: isUserLoggedIn,
    logIn: logInHanlder,
    logOut: logOutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
