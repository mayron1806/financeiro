import styles from "../modal.module.css";
import Modal from "react-modal";

import {modalStyle} from "../modalStyle";
import { selectStyle } from "../selectStyle";
import { AiOutlineClose } from "react-icons/ai";
import CategoryType from "../../../types/category";
import { FormEvent, useContext, useEffect, useId, useState } from "react";
import Select from "react-select";
import Submit from "../../submit";
import moment,{ Moment } from "moment";
import useCategory from "../../../hooks/useCategory";
import ScheduleTransationType from "../../../types/scheduleTransations";
import useSchedule from "../../../hooks/useSchedule";
import ScheduleTransationUpdateType from "../../../types/scheduleTransationUpdate";
import ResultContext from "../../../context/result";
import Icon from "../../../enum/iconType";
import ResultType from "../../../types/result";

type props = {
  isOpen: boolean,
  closeModal: ()=> void,
  scheduleToUpdate: ScheduleTransationType,
  onUpdate: ()=> void
}

const UpdateSchedule = ({isOpen, closeModal, scheduleToUpdate, onUpdate}: props) => {
  const resultContext = useContext(ResultContext);
  
  const { updateSchedule } = useSchedule();

  const { getCategories } = useCategory();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  useEffect(()=>{
    getCategories()
    .then((res)=>{ setCategories(res) })
    .catch((error)=>{ setError(error.message) })
  },[]);

  // IDs
  const name_id = useId();
  const value_id = useId();
  const category_id = useId();
  const next_id = useId();
  const max_id = useId();

  const [scheduleName, setScheduleName] = useState<string>(scheduleToUpdate.name);
  const [scheduleValue, setScheduleValue] = useState<number>(scheduleToUpdate.value);
  const [scheduleCategory, setScheduleCategory] = useState<CategoryType>(scheduleToUpdate.category);
  const [scheduleNext, setScheduleNext] = useState<Moment>(scheduleToUpdate.execution.next_date);
  const [scheduleMax, setScheduleMax] = useState<number | undefined>(scheduleToUpdate.execution.max);

  useEffect(()=>{
    setScheduleName(scheduleToUpdate.name);
    setScheduleValue(scheduleToUpdate.value);
    setScheduleCategory(scheduleToUpdate.category);
    setScheduleNext(scheduleToUpdate.execution.next_date);
    setScheduleMax(scheduleToUpdate.execution.max);
  }, [scheduleToUpdate])

  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const sendForm = (e: FormEvent) => {
    e.preventDefault();

    const id = scheduleToUpdate._id;
    if(!id) return setError("Categoria não selecionada, tente novamente.");

    setError("");
    setIsUpdating(true);
    
    let options: ScheduleTransationUpdateType = { _id: id };
    // verifica se foram alterados os dados, se sim recebe o valor atualizado, se não recebe undefined
    if(scheduleName && scheduleName !== scheduleToUpdate.name){
      options.name = scheduleName;
    }
    if(scheduleValue && scheduleValue !== scheduleToUpdate.value){
      options.value = scheduleValue;
    }
    if(scheduleCategory && scheduleCategory !== scheduleToUpdate.category){
      options.category = scheduleCategory;
    }
    if(scheduleNext && scheduleNext !== scheduleToUpdate.execution.next_date){
      options.next_date = scheduleNext;
    }
    if((scheduleMax && scheduleMax !== scheduleToUpdate.execution.max) || scheduleMax === 0){
      options.max = scheduleMax;
    }
    
    updateSchedule(options)
    .then(res => {
      const result: ResultType = {
        icon: Icon.SUCCESS,
        message: "Transação agendada atualizada com sucesso."
      };
      resultContext.set(result);

      onUpdate();
      closeModal();
    })
    .catch(error => {
      setError(error.message);
    })
    .finally(()=>{
      setIsUpdating(false);
    })
  }
  return(
    <div>
      <Modal
        ariaHideApp={false}
        isOpen={isOpen}
        style={modalStyle}
      >
        <div className={styles.head}>
          <h2>Atualizar transação</h2>
          <button onClick={() => closeModal()}><AiOutlineClose /></button>
        </div>
        <form className={styles.content} onSubmit={(e)=> sendForm(e)}>
          <label htmlFor={name_id}>Nome</label>
          <input 
            type="text" 
            id={name_id} 
            value={scheduleName} 
            onChange={(e) => setScheduleName(e.target.value)} 
          />
          <label htmlFor={value_id}>Valor(R$)</label>
          <input 
            type="number" 
            id={value_id} 
            step="0.01"
            value={scheduleValue} 
            onChange={(e) => setScheduleValue(parseFloat(e.target.value))} 
          />
          <label htmlFor={category_id}>Categoria</label>
          <Select 
            id={category_id}
            options={categories.map(category=> ({label: category.name, value: category}))}
            defaultValue={{label: scheduleCategory.name, value: scheduleCategory}}
            styles={selectStyle}
            onChange={(value) => setScheduleCategory(value?.value || scheduleToUpdate.category)}
          />
          <label htmlFor={next_id}>Proxima transação</label>
          <input 
            id={next_id}
            type="date"
            min={moment().format("YYYY-MM-DD")} 
            value={scheduleNext ? moment(scheduleNext).add(1, "day").format("YYYY-MM-DD") : undefined}
            onChange={(e)=> setScheduleNext(moment(e.target.value))}
          />
          <label htmlFor={max_id}>N° repetições</label>
          <input 
            type="number" 
            id={max_id} 
            step="1"
            value={scheduleMax} 
            onChange={(e) => setScheduleMax(parseFloat(e.target.value))} 
          />
          {
            error.length > 0 &&
            <p className={styles.error}>{error}</p>
          } 
          {
            isUpdating &&
            <p className={styles.loading}>Atualizando transação, aguarde...</p>
          }
          <Submit value="Atualizar"/>
        </form>
      </Modal>
    </div>
  )
}
export default UpdateSchedule;