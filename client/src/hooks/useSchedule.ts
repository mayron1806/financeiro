import ScheduleTransationType from "../types/scheduleTransations";
import useAuth from "./useAuth";
import * as scheduleAPI from "../services/schedule";
import axios from "axios";
import ScheduleTransationUpdateType from "../types/scheduleTransationUpdate";

const useSchedule = () => {
  const { authContext } = useAuth();
  const user_id = authContext.user?.id;

  const getSchedules = async () => {
    let transations : ScheduleTransationType[] = []; 
    if(!user_id){
      throw new Error("Você precisa estar logado para acessar suas transações.");
    }
    try{
      transations = (await scheduleAPI.getAll(user_id)).data;
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
  const createSchedule = async (schedule: ScheduleTransationType) => {
    if(!user_id){
      throw new Error("Você precisa estar logado para acessar suas transações.");
    }
    try{
      await scheduleAPI.create(user_id, schedule);
    } 
    catch(error){
      if(!axios.isAxiosError(error) || !error.response){
        throw new Error("Erro no servidor, tente novamente mais tarde.");
      }else{
        const message = error.response.data as string;
        throw new Error(message);
      }
    }
  }
  const updateSchedule = async (options: ScheduleTransationUpdateType) => {
    if(!user_id){
      throw new Error("Você precisa estar logado para acessar suas transações.");
    }
    try{
      await scheduleAPI.updateSchedule(user_id, options);
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
  const deleteSchedules = async (schedules: ScheduleTransationType[]) =>{
    if(!user_id){
      throw new Error("Você precisa estar logado para acessar suas transações.");
    }
    try{
      await scheduleAPI.deleteSchedule(user_id, schedules);
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
  return {getSchedules, createSchedule, updateSchedule, deleteSchedules}
}
export default useSchedule;