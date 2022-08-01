import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/auth";
import client from "../services/axios";
import UserType from "../types/user";

type authResult = {
  status: number,
  message: string
}
const useAuth = ()=> {
  const authContext = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authContext.user !== null);
  
  const signIn = async (name: string, password: string) => {
    let res : authResult = {} as authResult;
    try{
      const result = await client.post("/user/signin", { name, password });
      const user: UserType = {
        name: result.data.name,
        id: result.data._id
      }
      authContext.setUser(user);
      res.status = result.status;
      setIsAuthenticated(true);
    }
    catch(error){
      if(!axios.isAxiosError(error) || !error.response){
        res.message = "Erro ao efetuar login, tente novamente mais tarde.";
        res.status = 401;
      }else{
        const message = error.response.data as string;
        throw new Error(message);
      }
    }
    return res;
  }
  const signUp = async (name: string, password: string) => {
    let res : authResult = {} as authResult;
    try{
      const result = await client.post("/user/signup", { name, password });
      const user: UserType = {
        name: result.data.name,
        id: result.data._id
      }
      authContext.setUser(user);
      res.status = result.status;
      setIsAuthenticated(true);
    }
    catch(error){
      console.log(error);
      if(!axios.isAxiosError(error) || !error.response){
        res.message = "Erro ao efetuar login, tente novamente mais tarde.";
        res.status = 401;
      }else{
        const message = error.response.data as string;
        throw new Error(message);
      }
    }
    return res;
  }
  const signOut = async () => {
    authContext.setUser(null);
    setIsAuthenticated(false);
  }
  return {authContext, signIn, signUp, signOut, isAuthenticated}
}
export default useAuth;