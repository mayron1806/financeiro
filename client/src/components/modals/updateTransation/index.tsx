import styles from "../modal.module.css";
import Modal from "react-modal";

import {modalStyle} from "../modalStyle";
import { selectStyle } from "../selectStyle";
import { AiOutlineClose } from "react-icons/ai";
import CategoryType from "../../../types/category";
import { FormEvent, useContext, useEffect, useId, useState } from "react";
import Select from "react-select";
import Submit from "../../submit";
import useTransation from "../../../hooks/useTransation";
import moment,{ Moment } from "moment";
import TransationType from "../../../types/transation";
import useCategory from "../../../hooks/useCategory";
import TransationUpdateType from "../../../types/transationUpdate";
import ResultContext from "../../../context/result";
import Icon from "../../../enum/iconType";
import ResultType from "../../../types/result";

type props = {
  isOpen: boolean,
  closeModal: ()=> void,
  transationToUpdate: TransationType,
  onUpdate: ()=> void
}

const UpdateTransation = ({isOpen, closeModal, transationToUpdate, onUpdate}: props) => {
  const resultContext = useContext(ResultContext);
  
  const { updateTransation } = useTransation();

  const {getCategories} = useCategory();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  // IDs
  const name_id = useId();
  const category_id = useId();
  const date_id = useId();
  const value_id = useId();

  const [transationName, setTransationName] = useState<string>(transationToUpdate.name);
  const [transationValue, setTransationValue] = useState<number>(transationToUpdate.value);
  const [transationCategory, setTransationCategory] = useState<CategoryType>(transationToUpdate.category);
  const [transationDate, setTransationDate] = useState<Moment>(transationToUpdate.date);
  
  // quando a categoria para atuazização mudar, os states serão atualizados
  useEffect(()=>{
    setTransationName(transationToUpdate.name);
    setTransationValue(transationToUpdate.value);
    setTransationCategory(transationToUpdate.category);
    setTransationDate(transationToUpdate.date);
  }, [transationToUpdate]);
  
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  useEffect(()=>{
    getCategories()
    .then((res)=>{ setCategories(res) })
    .catch((error)=>{ setError(error.message) })
  },[]);

  const sendForm = (e: FormEvent) => {
    e.preventDefault();

    const id = transationToUpdate._id;
    if(!id) return setError("Categoria não selecionada, tente novamente.");
    if(moment(transationDate) > moment()) return setError("A data deve ser no maximo ate o dia de hoje.");
    
    setError("");
    setIsCreating(true);

    let options: TransationUpdateType = { _id: id };
    // verifica se foram alterados os dados, se sim recebe o valor atualizado, se não recebe undefined
    if(transationName && transationName !== transationToUpdate.name){
      options.name = transationName;
    }
    if(transationCategory && transationCategory !== transationToUpdate.category){
      options.category = transationCategory;
    }
    if(transationValue && transationValue !== transationToUpdate.value){
      options.value = transationValue;
    }
    if(transationDate && transationDate !== transationToUpdate.date){
      options.date = transationDate;
    }
    
    updateTransation(options)
    .then(() =>{
      const result: ResultType = {
        icon: Icon.SUCCESS,
        message: "Transação atualizada com sucesso."
      };
      resultContext.set(result);
      
      onUpdate();
      closeModal();
    })
    .catch(error=>{
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
        <div className={styles.head}>
          <h2>Atualizar transação</h2>
          <button onClick={() => closeModal()}><AiOutlineClose /></button>
        </div>
        <form className={styles.content} onSubmit={(e)=> sendForm(e)}>
          <label htmlFor={name_id}>Nome</label>
          <input 
            type="text" 
            id={name_id} 
            value={transationName} 
            onChange={(e) => setTransationName(e.target.value)} 
          />

          <label htmlFor={value_id}>Valor(R$)</label>
          <input 
            type="number" 
            id={value_id} 
            step="0.01"
            value={transationValue} 
            onChange={(e) => setTransationValue(parseFloat(e.target.value))} 
          />

          <label htmlFor={category_id}>Categoria</label>
          <Select 
            id={category_id}
            options={categories.map(category=> ({label: category.name, value: category}))}
            defaultValue={{label: transationCategory.name, value: transationCategory}}
            styles={selectStyle}
            onChange={(value) => setTransationCategory(value?.value || transationToUpdate.category)}
          />
          <label htmlFor={date_id}>Data da transação</label>
          <input 
            id={date_id}
            type="date"
            max={moment().format("YYYY-MM-DD")} 
            value={transationDate ? moment(transationDate).add(1, "day").format("YYYY-MM-DD") : undefined}
            onChange={(e)=> setTransationDate(moment(e.target.value))}
          />
          {
            error.length > 0 &&
            <p className={styles.error}>{error}</p>
          } 
          {
            isCreating &&
            <p className={styles.loading}>Atualizando transação, aguarde...</p>
          }
          <Submit value="Atualizar"/>
        </form>
      </Modal>
    </div>
  )
}
export default UpdateTransation;