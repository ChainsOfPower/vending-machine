import React, { useState } from "react";

export type AuthContextType = {
  accessToken: string;
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
  const [accessToken, setAccessToken] = useState<string>("");

  const isUserLoggedIn = !!accessToken;

  const logInHanlder = (token: string) => {
    setAccessToken(token);
  };

  const logOutHandler = () => {
    setAccessToken("");
  };

  const contextValue: AuthContextType = {
    accessToken,
    isLoggedIn: isUserLoggedIn,
    logIn: logInHanlder,
    logOut: logOutHandler
  };

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
