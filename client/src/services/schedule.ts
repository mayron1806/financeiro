import client from "./axios";
import ScheduleTransationType from "../types/scheduleTransations";
import ScheduleTransationUpdateType from "../types/scheduleTransationUpdate";

export const getAll = async(user_id: string) => {
  return await client.get<ScheduleTransationType[]>("/schedule", {
    headers: { "User-ID" : user_id }
  });
}
export const create = async(user_id: string, options: ScheduleTransationType)=>{
  return await client.post<ScheduleTransationType>("/schedule", 
    {
      name: options.name,
      value: options.value,
      category_id: options.category,
      next: options.execution.next_date,
      max: options.execution.max
    },
    { headers: { "User-ID": user_id } }
  );
}
export const updateSchedule = async (user_id: string, options: ScheduleTransationUpdateType) => {
  return await client.put<ScheduleTransationType[]>("/schedule", 
    {
      schedule_id: options._id,
      name: options.name,
      value: options.value,
      category_id: options.category,
      next: options.next_date,
      max: options.max
    },
    { headers: { "User-ID": user_id } }
  );
}
export const deleteSchedule = async (user_id: string, schedules: ScheduleTransationType[]) => {
  return await client.delete<ScheduleTransationType[]>("/schedule", {
    headers: { "User-ID": user_id },
    data: {schedules}
  });
}