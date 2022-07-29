import Category from "../pages/system/pages/category";
import CategoryType from "../types/category"
import CategoryUpdateType from "../types/categoryUpdate";
import CategoryFilterType from "../types/categotyFilter";
import client from "./axios"

const category_url = "/category";

export const createCategory = async (user_id: string, category: CategoryType)=>{
  return await client.post<CategoryType>(category_url, {
    name: category.name,
    is_entry: category.is_entry,
    color: category.color
  }, {headers: {"User-ID": user_id}});
}
export const getCategories = async (user_id: string, options: CategoryFilterType = {}) => {
  return await client.get<CategoryType[]>(category_url, {
    headers:{ "User-ID": user_id },
    params: options
  });
}
export const updateCategory = async (user_id: string, options: CategoryUpdateType) => {
  return await client.put<CategoryType>(category_url, {
    name : options.name,
    is_entry : options.is_entry,
    color : options.color,
    category_id: options._id
  }, { headers: { "User-ID": user_id }});
}
export const deleteCategory = async (user_id: string, categories: CategoryType[]) => {
  return await client.delete<CategoryType>(category_url, {
    headers: { "User-ID": user_id},
    data: {categories}
  })
}