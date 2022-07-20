import UserType from "../types/user";
import client from "./axios"

export const signin = async (name: string, password: string) => {
  return await client.post<UserType>("/user/signin", { name, password });
} 
export const signup = async (name: string, password: string)=> {
  return await client.post<UserType>("/user/signup", { name, password });
}