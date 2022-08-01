import  { FormEvent, useContext, useEffect, useId, useState } from "react";
import Modal from "react-modal";
import Select from "react-select";
import Submit from "../../submit";
import styles from "../modal.module.css";
import {AiOutlineClose} from "react-icons/ai";
import CategoryType from "../../../types/category";
import TransationType from "../../../types/transation";
import useTransation from "../../../hooks/useTransation";
import moment, { Moment } from "moment";
import { modalStyle } from "../modalStyle";
import { selectStyle } from "../selectStyle";
import useCategory from "../../../hooks/useCategory";
import ResultContext from "../../../context/result";
import Icon from "../../../enum/iconType";
import ResultType from "../../../types/result";


type props = {
  isOpen: boolean,
  closeModal: ()=> void,
  onAdd: ()=> void
}
const AddTransation = ({isOpen, closeModal, onAdd}: props) => {
  const resultContext = useContext(ResultContext);
  // categorias 
  const { getCategories } = useCategory();
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(()=>{
    getCategories()
    .then(res => {
      setCategories(res);
    })
    .catch(error => {
      console.log(error);
    });
  }, [])
  
  // transações
  const { createTransation } = useTransation();
  
  const [transationName, setTransationName] = useState<string>("");
  const [transationValue, setTransationValue] = useState<number>(0);
  const [transationCategory, setTransationCategory] = useState<CategoryType>();
  const [transationDate, setTransationDate] = useState<Moment>(moment());

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // IDs
  const name_id = useId();
  const category_id = useId();
  const date_id = useId();
  const value_id = useId();

  const sendForm = (e: FormEvent) => {
    e.preventDefault();

    if(transationName.length < 3 || transationName.length > 20) return setError("O nome da transação deve ter entre 3 e 20 caracteres.");
    if(transationValue === 0 || isNaN(transationValue)) return setError("Você precisa definir um valor para a transação.");
    if(!transationCategory) return setError("Defina uma categoria para a transação.");
    if(!transationDate) return setError("Você precisa definir uma data para essa transação.");
    if(moment(transationDate) > moment()) return setError("A data deve ser no maximo ate o dia de hoje.");
    
    setError("");
    setIsCreating(true);
    
    const transation: TransationType = {
      name: transationName,
      value: transationValue,
      category: transationCategory,
      date: transationDate
    }
    createTransation(transation)
    .then(() =>{
      // reset form
      setTransationName("");
      setTransationValue(0);
      setTransationCategory(undefined);
      setTransationDate(moment());

      const result: ResultType = {
        icon: Icon.SUCCESS,
        message: "Transação adicionada com sucesso."
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
        <div className={styles.head}>
          <h2>Adicionar transação</h2>
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

          <label htmlFor={category_id}>Valor(R$)</label>
          <input 
            type="number" 
            id={value_id} 
            step="0.01"
            value={transationValue} 
            onChange={(e) => setTransationValue(parseFloat(e.target.value))} 
          />

          <label htmlFor={date_id}>Categoria</label>
          <Select 
            options={categories.map(category=> ({label: category.name, value: category}))}
            styles={selectStyle}
            onChange={(value) => setTransationCategory(value?.value)}
          />

          <label htmlFor={date_id}>Data da transação</label>
          <input 
            type="date"
            max={moment().format("YYYY-MM-DD")} 
            value={transationDate ? moment(transationDate).format("YYYY-MM-DD") : undefined}
            onChange={(e)=> setTransationDate(moment(e.target.value))}
          />
          {
            error.length > 0 &&
            <p className={styles.error}>{error}</p>
          } 
          {
            isCreating &&
            <p className={styles.loading}>Criando transação aguarde...</p>
          }
          <Submit value="Criar"/>
        </form>
      </Modal>
    </div>
  )
}
export default AddTransation;