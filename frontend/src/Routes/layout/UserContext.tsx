import React from "react";
import { createContext, useState, ReactNode } from "react";


interface UserContextProviderProps {
  children: ReactNode;
}

interface UserInfo {
  name?: string;
  email?: string;
  // Add other fields as needed
}

interface UserContextType {
  userInfo: UserInfo | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);;

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}
