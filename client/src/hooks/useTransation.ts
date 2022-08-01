import axios from "axios";
import { Moment } from "moment";
import * as transationsAPI from "../services/transations";
import CategoryType from "../types/category";
import TransationType from "../types/transation";
import TransationFilterType from "../types/transationFilter";
import TransationUpdateType from "../types/transationUpdate";
import useAuth from "./useAuth";

const useTransation = ()=>{
  const { authContext } = useAuth();
  const user_id = authContext.user?.id;

  const getTransations = async (options?: TransationFilterType) => {
    let transations: TransationType[] = [];
    if(!user_id){
      throw new Error("Você precisa estar logado para acessar suas transações.");
    }
    try{
      transations = (await transationsAPI.getTransation(user_id, options)).data;
    } 
    catch(error){
      console.log(error);
      if(!axios.isAxiosError(error) || !error.response){
        throw new Error("Erro no servidor, tente novamente mais tarde.");
      }else{
        const message = error.response.data as string;
        throw new Error(message);
      }
    }
    return transations;
  }
  const createTransation = async (transation: TransationType) => {
    if(!user_id){
      throw new Error("Você precisa estar logado para acessar suas transações.");
    }
    try{
      await transationsAPI.createTransation(user_id, transation);
    } 
    catch(error){
      console.log(error);
      if(!axios.isAxiosError(error) || !error.response){
        throw new Error("Erro no servidor, tente novamente mais tarde.");
      }else{
        const message = error.response.data as string;
        throw new Error(message);
      }
    }
  }
  const updateTransation = async (options: TransationUpdateType) => {
    if(!user_id){
      throw new Error("Você precisa estar logado para acessar suas transações.");
    }
    try{
      await transationsAPI.updateTransation(user_id, options);
    } 
    catch(error){
      console.log(error);
      if(!axios.isAxiosError(error) || !error.response){
        throw new Error("Erro no servidor, tente novamente mais tarde.");
      }else{
        const message = error.response.data as string;
        throw new Error(message);
      }
    }
  }
  const deleteTransations = async (transations: TransationType[]) => {
    if(!user_id){
      throw new Error("Você precisa estar logado para acessar suas transações.");
    }
    try{
      await transationsAPI.deleteTransation(user_id, transations);
    } 
    catch(error){
      console.log(error);
      if(!axios.isAxiosError(error) || !error.response){
        throw new Error("Erro no servidor, tente novamente mais tarde.");
      }else{
        const message = error.response.data as string;
        throw new Error(message);
      }
    }
  }
  return { getTransations, createTransation, updateTransation, deleteTransations };
}
export default useTransation;