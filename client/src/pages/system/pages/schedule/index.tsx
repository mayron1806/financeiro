import { useEffect, useState } from "react";
import { BiAddToQueue } from "react-icons/bi";
import Header from "../../../../components/header";
import AddSchedule from "../../../../components/modals/addSchedule";
import ScheduleTable from "../../../../components/scheduleTable";
import useSchedule from "../../../../hooks/useSchedule";
import ScheduleTransationType from "../../../../types/scheduleTransations";
import pageStyle from "../pages.module.css";

const Schedule = () => {
  const [addScheduleIsOpen, setAddScheduleIsOpen] = useState<boolean>(false);
  const openModal = ()=> setAddScheduleIsOpen(true);
  const closeModal = ()=> setAddScheduleIsOpen(false);

  const { getScheduleTransations } = useSchedule();
  const [scheduleTransatios, setScheduleTransatios] = useState<ScheduleTransationType[]>([]);

  const fetchSchedules = ()=>{
    getScheduleTransations()
    .then(res=>{
      setScheduleTransatios(res);
    })
    .catch(error=>{
      console.log(error);
    })
  }
  
  useEffect(() => {fetchSchedules()}, [])
  return(
    <div>
      <Header title="Agendar"/>
      <div className={pageStyle.content}>
        <div className={pageStyle.head}>
          <h3>Transações agendadas</h3>
          <button 
            className={pageStyle.button}
            onClick={() => openModal()}
          >Criar <BiAddToQueue />
          </button>
        </div>
        <div>
          <ScheduleTable schedules={scheduleTransatios} onChange={fetchSchedules}/>
        </div>
      </div>
      <AddSchedule 
        isOpen={addScheduleIsOpen} 
        closeModal={closeModal} 
        setSchedules={setScheduleTransatios}
      />
    </div>
  )
}
export default Schedule;