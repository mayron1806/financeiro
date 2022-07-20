import React, { createContext, Dispatch, useState } from "react";
import UserType from "../types/user";
type AuthContextProps = {
  user: UserType | null,
  setUser: Dispatch<React.SetStateAction<UserType | null>>
};
export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

type providerProps = {
  children: JSX.Element
}

export const AuthProvider = ({children} : providerProps)=>{
  const [user, setUser] = useState<UserType | null>(null); 
  return(
    <AuthContext.Provider value={{user, setUser}}>
      {children}
    </AuthContext.Provider>
  )
}