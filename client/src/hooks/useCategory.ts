import axios from "axios";
import * as categoryAPI from "../services/category";
import CategoryType from "../types/category";
import CategoryUpdateType from "../types/categoryUpdate";
import CategoryFilterType from "../types/categotyFilter";
import useAuth from "./useAuth";
const useCategory = () => {
  const { authContext } = useAuth();
  const user_id = authContext.user?.id;
  
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
      }else{
        const message = error.response.data as string;
        throw new Error(message);
      }
    }
    return categories;
  }
  const createCategory = async (category: CategoryType) => {
    if(!user_id){
      throw new Error("Você precisa estar logado para acessar suas transações.");
    }
    try{
      await categoryAPI.createCategory(user_id, category);
    }
    catch(error){
      if(!axios.isAxiosError(error) || !error.response){
        throw new Error("Erro no servidor, tente novamente mais tarde");
      }else{
        const message = error.response.data as string;
        throw new Error(message);
      }
    }
  }
  const updateCategory = async (options: CategoryUpdateType) => {
    if(!user_id){
      throw new Error("Você precisa estar logado para acessar suas transações.");
    }
    try{
      await categoryAPI.updateCategory(user_id, options);
    }
    catch(error){
      if(!axios.isAxiosError(error) || !error.response){
        throw new Error("Erro no servidor, tente novamente mais tarde");
      }else{
        const message = error.response.data as string;
        throw new Error(message);
      }
    }
  }
  const deleteCategory = async (categories: CategoryType[] ) =>{
    if(!user_id){
      throw new Error("Você precisa estar logado para acessar suas transações.");
    }
    try{
      await categoryAPI.deleteCategory(user_id, categories);
    }
    catch(error){
      if(!axios.isAxiosError(error) || !error.response){
        throw new Error("Erro no servidor, tente novamente mais tarde");
      }else{
        const message = error.response.data as string;
        throw new Error(message);
      }
    }
  }
  return {createCategory, getCategories, updateCategory, deleteCategory};
}
export default useCategory;