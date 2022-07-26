import CategoryType from "../types/category"
import CategoryFilterType from "../types/categotyFilter";
import client from "./axios"

export const createCategory = async (user_id: string, category: CategoryType)=>{
  return await client.post<CategoryType[]>("/category", {
    name: category.name,
    is_entry: category.is_entry,
    color: category.color
  }, {headers: {"User-ID": user_id}});
}
export const getCategories = async (user_id: string, options: CategoryFilterType = {}) => {
  return await client.get<CategoryType[]>("/category", {
    headers:{
      "User-ID": user_id
    },
    params: options
  });
}