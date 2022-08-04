import React, { useState } from "react";
import { UserRole } from "../api-types/api-types";
import jwt from "jwt-decode";
import useAxios from "axios-hooks";
import { notification } from "antd";

export type JwtPayload = {
  id: number;
  role: UserRole;
};

export type AuthContextType = {
  jwtPayload: JwtPayload | null;
  isLoggedIn: boolean;
  logIn: (token: string, refreshToken: string) => void;
  logOut: () => void;
  logOutAllSessions: () => void;
  isBuyer: boolean;
  isSeller: boolean;
};

const AuthContext = React.createContext<AuthContextType>({
  jwtPayload: null,
  isLoggedIn: false,
  logIn: (token: string, refreshToken: string) => {},
  logOut: () => {},
  logOutAllSessions: () => {},
  isBuyer: false,
  isSeller: false,
});

interface Props {
  children: React.ReactNode;
}

export const AuthContextProvider: React.FC<Props> = ({ children }) => {
  const initialToken = localStorage.getItem("token");

  const initialJwtPayload = initialToken ? jwt<JwtPayload>(initialToken) : null;

  const [jwtPayload, setJwtPayload] = useState<JwtPayload | null>(
    initialJwtPayload
  );

  const [, executeRevoke] = useAxios(
    { url: "/auth/revoke", method: "POST" },
    { manual: true }
  );

  const [, executeRevokeAll] = useAxios(
    { url: "auth/revoke-all", method: "POST" },
    { manual: true }
  );

  const logInHanlder = (token: string, refreshToken: string) => {
    setJwtPayload(jwt(token));
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const logOutHandler = () => {
    const refreshToken = localStorage.getItem("refreshToken");
    executeRevoke({ data: { refreshToken } })
      .then(() => {
        setJwtPayload(null);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      })
      .catch((error) => {
        notification.error({
          message: "Error logging out",
          description: error?.response?.data?.message,
        });
      });
  };

  const logOutAllSessionsHandler = () => {
    executeRevokeAll()
      .then(() => {
        setJwtPayload(null);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      })
      .catch((error) => {
        notification.error({
          message: "Error logging out from all sessions",
          description: error?.response?.data?.message,
        });
      });
  };

  const isUserLoggedIn = !!jwtPayload;
  const isBuyer = jwtPayload?.role === UserRole.BUYER;
  const isSeller = jwtPayload?.role === UserRole.SELLER;

  const contextValue: AuthContextType = {
    jwtPayload,
    isLoggedIn: isUserLoggedIn,
    logIn: logInHanlder,
    logOut: logOutHandler,
    logOutAllSessions: logOutAllSessionsHandler,
    isBuyer,
    isSeller,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
