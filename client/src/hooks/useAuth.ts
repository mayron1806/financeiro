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
      const result = await client.post<UserType>("/user/signin", { name, password });
      authContext.setUser(result.data);
      res.status = result.status;
      setIsAuthenticated(true);
    }
    catch(error){
      if(!axios.isAxiosError(error) || !error.response){
        res.message = "Erro ao efetuar login, tente novamente mais tarde.";
        res.status = 401;
      }
      else{
        const status = error.response.status;
        res.status = status;
        if(status === 400){
          res.message = "Nome ou senha incorretos.";
        }
        else if(status === 404){
          res.message = "Usuario não encontrado.";
        }
        else{
          res.message = "Erro ao efetuar login, tente novamente mais tarde.";
        }
      }
    }
    return res;
  }
  const signUp = async (name: string, password: string) => {
    let res : authResult = {} as authResult;
    try{
      const result = await client.post<UserType>("/user/signup", { name, password });
      authContext.setUser(result.data);
      res.status = result.status;
      setIsAuthenticated(true);
    }
    catch(error){
      console.log(error);
      if(!axios.isAxiosError(error) || !error.response){
        res.message = "Erro ao efetuar login, tente novamente mais tarde.";
        res.status = 401;
      }
      else{
        const status = error.response.status;
        res.status = status;
        if(status === 400){
          res.message = "Nome de usuario já está em uso.";
        }
        else{
          res.message = "Erro ao efetuar login, tente novamente mais tarde.";
        }
      }
    }
    return res;
  }
  const signOut = async () => {
    authContext.setUser(null);
    setIsAuthenticated(false);
  }
  return {signIn, signUp, signOut, isAuthenticated}
}
export default useAuth;