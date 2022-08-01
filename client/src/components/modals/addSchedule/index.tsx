import modalStyles from "../modal.module.css";
import styles from "./addSchedule.module.css";
import Modal from "react-modal";
import { modalStyle } from "../modalStyle";
import { selectStyle } from "../selectStyle";
import { AiOutlineClose } from "react-icons/ai";
import React, { Dispatch, FormEvent, useContext, useEffect, useId, useState } from "react";
import Select from "react-select";
import moment, { Moment } from "moment";
import Submit from "../../submit";
import CategoryType from "../../../types/category";
import useCategory from "../../../hooks/useCategory";
import useSchedule from "../../../hooks/useSchedule";
import ScheduleTransationType from "../../../types/scheduleTransations";
import ResultContext from "../../../context/result";
import Icon from "../../../enum/iconType";
import ResultType from "../../../types/result";

type props = {
  isOpen: boolean,
  closeModal: () => void,
  onAdd: () => void
}
const AddSchedule = ({isOpen, closeModal, onAdd}: props) => {
  const resultContext = useContext(ResultContext);

  const { createSchedule } = useSchedule();

  //IDs
  const name_id = useId();
  const value_id = useId();
  const repeat_id = useId();
  const date_id = useId();

  const [transationName, setTransationName] = useState<string>("");
  const [transationValue, setTransationValue] = useState<number>(0);
  const [transationCategory, setTransationCategory] = useState<CategoryType>();
  const [nextTransationDate, setNextTransationDate] = useState<Moment>(moment());
  const [repeatCount, setRepeatCount] = useState<number>(0);

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // categorias
  const { getCategories } = useCategory();
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(()=>{ 
    getCategories()
    .then(res=>{
      setCategories(res);
    })
    .catch(error=>{
      setError(error);
    })
  }, [])

  const sendForm = (e: FormEvent)=>{
    e.preventDefault();
    
    if(transationName.length < 3 || transationName.length > 20) return setError("O nome da transação deve ter entre 3 e 20 caracteres.");
    if(!transationCategory) return setError("Selecione uma categoria para a transação.");
    if(transationValue === 0) return setError("Defina um valor para a transação.");
    if(moment(nextTransationDate).isBefore(moment(), "date")) return setError("Não é possivel agendar uma transação para uma data que já passou.");
    
    setError("");

    const schedule : ScheduleTransationType = {
      name: transationName,
      value: transationValue,
      category: transationCategory,
      execution: {
        next_date: nextTransationDate,
        max: repeatCount
      }
    } 
    setIsCreating(true);
    createSchedule(schedule)
    .then(res => {
      //reset 
      setTransationName("");
      setTransationCategory(undefined);
      setNextTransationDate(moment());
      setRepeatCount(0);
      setTransationValue(0);

      const result: ResultType = {
        icon: Icon.SUCCESS,
        message: "Transação agendada adicionada com sucesso."
      };
      resultContext.set(result);
      
      onAdd();
      
      closeModal();
    })
    .catch(error => {
      setError(error.message);
    })
    .finally(()=>{
      setIsCreating(false);
    })
  }

  return( 
    <div>
      <Modal
        ariaHideApp={false}
        isOpen={isOpen}
        style={modalStyle}
      >
        <div className={modalStyles.head}>
          <h2>Agendar transação</h2>
          <button onClick={() => closeModal()}><AiOutlineClose /></button>
        </div>
        <form className={modalStyles.content} onSubmit={(e)=> sendForm(e)}>
          <div className={styles.formContent}>
            <label htmlFor={name_id}>Nome</label>
            <input 
              type="text" 
              id={name_id} 
              value={transationName} 
              onChange={(e)=>setTransationName(e.target.value)} 
            />
            <label htmlFor={value_id}>Valor(R$)</label>
            <input 
              type="number" 
              id={value_id} 
              step="0.01"
              value={transationValue} 
              onChange={(e) => setTransationValue(parseFloat(e.target.value))} 
            />
            <label>Categoria</label>
            <Select
              options={categories.map(category=> ({label: category.name, value: category}))}
              styles={selectStyle}
              onChange={(value) => setTransationCategory(value?.value)}
            />
            <label htmlFor={repeat_id}>N° repetições</label>
            <input 
              type="number" 
              id={repeat_id} 
              step="1"
              value={repeatCount} 
              onChange={(e) => setRepeatCount(parseInt(e.target.value))} 
            />
            <label htmlFor={date_id}>Proxima transação</label>
            <input 
              id={date_id}
              type="date"
              min={moment().format("YYYY-MM-DD")} 
              value={nextTransationDate ? moment(nextTransationDate).format("YYYY-MM-DD") : undefined}
              onChange={(e)=> setNextTransationDate(moment(e.target.value))}
            />
            {
              error.length > 0 &&
              <p className={modalStyles.error}>{error}</p>
            }
            {
              isCreating &&
              <p className={modalStyles.loading}>Um momento, estamos agendando a trabsação para você.</p>
            }
            <Submit value="Agendar" style={{gridColumn: "1 / span 2"}}/>
          </div>
        </form>
      </Modal>
    </div>
  )
}
export default AddSchedule;