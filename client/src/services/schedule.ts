import client from "./axios";
import ScheduleTransationType from "../types/scheduleTransations";

export const getAll = async(user_id: string) => {
  return await client.get<ScheduleTransationType[]>("/schedule", {
    headers: { "User-ID" : user_id }
  });
}
export const create = async(user_id: string, options: ScheduleTransationType)=>{
  return await client.post<ScheduleTransationType[]>("/schedule", 
    {
      name: options.name,
      value: options.value,
      category: options.category._id,
      next: options.execution.next_date,
      n_executions: options.execution.max
    },
    { headers: { "User-ID": user_id } }
  );
}