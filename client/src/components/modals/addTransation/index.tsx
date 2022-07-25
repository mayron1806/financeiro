import React, { Dispatch, FormEvent, useEffect, useId, useState } from "react";
import Modal from "react-modal";
import Select, { CSSObjectWithLabel } from "react-select";
import Submit from "../../submit";
import styles from "../modal.module.css";
import {AiOutlineClose} from "react-icons/ai";
import useCategory from "../../../hooks/useCategory";
import useAuth from "../../../hooks/useAuth";
import CategoryType from "../../../types/category";
import TransationType from "../../../types/transation";
import useTransation from "../../../hooks/useTransation";
import moment from "moment";

//styles
const modalStyle = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    backgroundColor: "var(--black-light)",
    border: 0,
    height: "fit-content"
  },
  overlay: {backgroundColor: "rgba(0,0,0,0.1)"}
}
const selectStyle = {
  control: (styles : CSSObjectWithLabel) => ({
    ...styles, 
    backgroundColor: "transparent",
    border: "1px solid var(--white)"
  }),
  menu: (styles: CSSObjectWithLabel)=>({
    ...styles, backgroundColor: "var(--black)"
  }), 
  option: (styles: CSSObjectWithLabel)=>({
    ...styles, backgroundColor: "var(--black)", color:"var(--white)"
  }),
  singleValue: (styles: CSSObjectWithLabel)=>({
    ...styles, color: "var(--white)"
  })
}

type props = {
  isOpen: boolean,
  closeModal: ()=> void,
  setTransations: Dispatch<React.SetStateAction<TransationType[]>>
}
const AddTransation = ({isOpen, closeModal, setTransations}: props) => {
  const { authContext } = useAuth();
  const { createTransation } = useTransation(authContext.user?.id);
  const { getCategories } = useCategory(authContext.user?.id);

  const [categories, setCategories] = useState<CategoryType[]>([]);
  //const categoriesm = categories.map(category=> {label: category.name, value: category._id})
  useEffect(()=>{
    getCategories()
    .then(res=>{
      setCategories(res);
    })
    console.log(categories);
  }, [])

  // IDs
  const name_id = useId();
  const category_id = useId();
  const date_id = useId();
  const value_id = useId();

  const [transationName, setTransationName] = useState<string>("");
  const [transationValue, setTransationValue] = useState<number>(0);
  const [transationCategory, setTransationCategory] = useState<CategoryType | undefined>();

  const [isCreating, setIsCreating] = useState<boolean>(false);

  const [error, setError] = useState<string>("");
  
  const sendForm = (e: FormEvent) => {
    e.preventDefault();
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
        <form className={styles.form} onSubmit={(e)=> sendForm(e)}>
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
          />
          <Submit value="Criar"/>
        </form>
      </Modal>
    </div>
  )
}
export default AddTransation;