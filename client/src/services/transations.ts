import TransationType from "../types/transation";
import TransationFilterType from "../types/transationFilter";
import client from "./axios"

export const getAll = async (user_id: string) => {
  return await client.get<TransationType[]>("/transation", {
    headers: {"User-ID": user_id}
  });
}
export const getWithFilter = async (user_id: string, options: TransationFilterType) => {
  console.log(options);
  return await client.get<TransationType[]>("/transation", {
    headers: {"User-ID": user_id},
    params: options
  })
}
export const create = async(user_id: string, transation: TransationType)=> {
 
  return await client.post<TransationType>("/transation", {
    name: transation.name,
    value: transation.value,
    category: transation.category,
    date: transation.date
  }, {headers: {"User-ID": user_id}});
}

