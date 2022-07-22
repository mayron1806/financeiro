import TransationType from "../types/transation";
import TransationFilterType from "../types/transationFilter";
import client from "./axios"

export const getAll = async (user_id: string) => {
  return await client.get<TransationType[]>("/transation", {
    headers: {"User-ID": user_id}
  });
}
export const getWithFilter = async (user_id: string, options: TransationFilterType) => {  
  return await client.get<TransationType[]>("/transation", {
    headers: {"User-ID": user_id},
    params: options
  })
}

