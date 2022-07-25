import axios from "axios";
import * as categoryAPI from "../services/category";
import CategoryType from "../types/category";
import CategoryFilterType from "../types/categotyFilter";
const useCategory = (user_id: string | undefined) => {

  const getCategories = async (options: CategoryFilterType = {}) => {
    let categories: CategoryType[] =[];
    if(!user_id){
      throw new Error("Você precisa estar logado para acessar suas transações.");
    }
    try{
      categories = (await categoryAPI.getCategories(user_id, options)).data;
    } 
    catch(error){
      if(!axios.isAxiosError(error) || !error.response){
        throw new Error("Erro no servidor, tente novamente mais tarde");
      }
      else{
        const status = error.response.status;
        const message = error.response.data;
        throw new Error(message + status.toString());
      }
    }
    return categories;
  }
  const createCategory = async (name: string, is_entry: boolean, color: string) => {
    let categories: CategoryType[] = [];
    if(!user_id){
      throw new Error("Você precisa estar logado para acessar suas transações.");
    }
    try{
      const new_category: CategoryType = {name, is_entry, color}
      categories = (await categoryAPI.createCategory(user_id, new_category)).data;
    }
    catch(error){
      if(!axios.isAxiosError(error) || !error.response){
        throw new Error("Erro no servidor, tente novamente mais tarde");
      }
      else{
        const status = error.response.status;
        const message = error.response.data;
        if(status === 409){
          throw new Error("Esse nome de categoria já está em uso.");
        }
        throw new Error(message + status.toString());
      }
    }
    return categories;
  }
  return {createCategory, getCategories};
}
export default useCategory;