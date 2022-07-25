import axios from "axios";
import * as transationsAPI from "../services/transations";
import TransationType from "../types/transation";
import TransationFilterType from "../types/transationFilter";

const useTransation = (user_id: string | undefined )=>{

  const getAllTransations = async ()=>{
    let transations : TransationType[] = []; 
    if(!user_id){
      throw new Error("Você precisa estar logado para acessar suas transações.");
    }
    try{
      transations = (await transationsAPI.getAll(user_id)).data;
    }
    catch(error){
      if(!axios.isAxiosError(error) || !error.response){
        throw new Error("Erro no servidor, tente novamente mais tarde.");
      }
      else{
        const status = error.response.status;
        const message = error.response.data;
        if(status === 404 && (message === "User id not found" || message === "User not found")){
          throw new Error("Transações não encontradas, tente realizar o login novamente.");
        }
      }
    }
    return transations;
  }
  
  const getFilteredTransations = async (options: TransationFilterType) => {
    let transations: TransationType[] = [];
    if(!user_id){
      throw new Error("Você precisa estar logado para acessar suas transações.");
    }
    try{
      transations = (await transationsAPI.getWithFilter(user_id, options)).data;
    } 
    catch(error){
      console.log(error);
      if(!axios.isAxiosError(error) || !error.response){
        throw new Error("Erro no servidor, tente novamente mais tarde.");
      }
      else{
        const status = error.response.status;
        const message = error.response.data;
        if(status === 404 && (message === "User id not found" || message === "User not found")){
          throw new Error("Transações não encontradas, tente realizar o login novamente.");
        }
      }
    }
    return transations;
  }
  const createTransation = async (transation: TransationType) => {

  }

  return { getAllTransations, getFilteredTransations, createTransation };
}
export default useTransation;