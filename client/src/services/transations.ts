import { Moment } from "moment";
import CategoryType from "../types/category";
import TransationType from "../types/transation";
import TransationFilterType from "../types/transationFilter";
import TransationUpdateType from "../types/transationUpdate";
import client from "./axios"

const transation_url = "/transation";
export const getTransation = async (user_id: string, options?: TransationFilterType) => {
  return await client.get<TransationType[]>(transation_url, {
    headers: {"User-ID": user_id},
    params: {
      name: options?.name,
      value: options?.value,
      categories: options?.categories?.map(category => category._id),
      is_entry: options?.is_entry,
      min_date: options?.min_date,
      max_date: options?.max_date
    }
  })
}
export const createTransation = async(user_id: string, transation: TransationType)=> {
  return await client.post<TransationType>(transation_url, {
    name: transation.name,
    value: transation.value,
    category: transation.category,
    date: transation.date
  }, { headers: {"User-ID": user_id} });
}
export const updateTransation = async(user_id: string, options: TransationUpdateType) => {
  return await client.put<TransationType>(transation_url, {
    name: options.name,
    value: options.value,
    category_id: options.category?._id,
    transation_id: options._id,
    date: options.date
  }, {headers: {"User-ID": user_id}});
}
export const deleteTransation = async (user_id: string, transations: TransationType[]) => {
  return await client.delete<TransationType>(transation_url, {
    headers: { "User-ID": user_id },
    data: { transations }
  });
}

