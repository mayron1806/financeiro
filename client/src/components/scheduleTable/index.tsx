import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { BsSafe } from "react-icons/bs";
import ResultContext from "../../context/result";
import Icon from "../../enum/iconType";
import useSchedule from "../../hooks/useSchedule";
import ResultType from "../../types/result";
import ScheduleTransationType from "../../types/scheduleTransations";
import { formatColorNumbers, formatMoney } from "../../utils/format";
import UpdateSchedule from "../modals/updateSchedule";
import styles from "./schedule.module.css";

type props = {
  schedules: ScheduleTransationType[],
  onChange: ()=> void
}
const ScheduleTable = ({ schedules, onChange}: props) => {
  const resultContext = useContext(ResultContext);

  const { deleteSchedules } = useSchedule();

  const del = (schedule: ScheduleTransationType)=>{
    if(!schedule._id) return;
    deleteSchedules([schedule])
    .then(res => {  
      onChange();
      const result: ResultType = {
        icon: Icon.SUCCESS,
        message: "Transação agendada deletada com sucesso."
      };
      resultContext.set(result);
    })
    .catch(error => {
      const result: ResultType = {
        icon: Icon.SUCCESS,
        message: error.message
      };
      resultContext.set(result);
    })
  }

  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleTransationType>();

  const [updateIsOpen, setUpdateIsOpen] = useState<boolean>(false);
  const openUpdateModal = () => setUpdateIsOpen(true);
  const closeUpdateModal = () => setUpdateIsOpen(false);
  
  return(
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{textAlign: "left"}}>Nome</th>
            <th>Valor</th>
            <th>Categoria</th>
            <th>Proxima transação</th>
            <th>N° repetições</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            schedules.map((schedule, index) =>{
              const {name, category, value, execution} = schedule;
              
              return(
                <tr key={index}>
                  <td style={{textAlign: "left"}}>{name}</td>
                  <td style={formatColorNumbers(value)}>
                    {formatMoney(value)}
                  </td>
                  <td>
                    <span 
                      className={styles.category} 
                      style={{backgroundColor: category.color}}
                    >{category.name}</span>
                  </td>
                  <td>{moment(execution.next_date).add(1, "day").format("DD/MM/YYYY")}</td>
                  <td>
                    {
                      execution.max &&
                        (execution.count + "/" + execution.max)
                      ||
                        <p>Infinito</p>
                    }
                  </td>
                  <td className={styles.icon}>
                    <BiEdit onClick={() => {
                        setSelectedSchedule(schedule);
                        openUpdateModal();
                      }} 
                    />
                  </td>
                  <td className={styles.icon}>
                    <AiOutlineClose onClick={()=> del(schedule)}/>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
      {
        schedules.length < 1 &&
        <div className={styles.no_transations}>
          <BsSafe />
          <p>Ainda não foram adicionadas transações.</p>
        </div>
      }
      {
        selectedSchedule &&
        <UpdateSchedule 
          isOpen={updateIsOpen} 
          closeModal={closeUpdateModal}
          scheduleToUpdate={selectedSchedule}
          onUpdate={onChange}
        />
      }
    </div>
  )
}
export default ScheduleTable;