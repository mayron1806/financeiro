import ScheduleTransationType from "../types/scheduleTransations";
import useAuth from "./useAuth";
import * as scheduleAPI from "../services/schedule";
import axios from "axios";

const useSchedule = () => {
  const { authContext } = useAuth();
  const user_id = authContext.user?.id;

  const getScheduleTransations = async () => {
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
  const addScheduleTransation = async (schedule: ScheduleTransationType) => {
    let schedules : ScheduleTransationType[] = [];
    if(!user_id){
      throw new Error("Você precisa estar logado para acessar suas transações.");
    }
    try{
      schedules = (await scheduleAPI.create(user_id, schedule)).data;
    } 
    catch(error){
      if(!axios.isAxiosError(error) || !error.response){
        throw new Error("Erro no servidor, tente novamente mais tarde.");
      }
      else{
        const status = error.response.status;
        const message = error.response.data;
        throw new Error(message + status.toString());
      }
    }
    return schedules;
  }
  return {getScheduleTransations, addScheduleTransation}
}
export default useSchedule;