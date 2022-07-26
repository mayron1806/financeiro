import React, { Dispatch, FormEvent, useId, useState } from "react";
import Modal from "react-modal";
import Select from "react-select";
import Submit from "../../submit";
import styles from "../modal.module.css";
import {AiOutlineClose} from "react-icons/ai";
import useCategory from "../../../hooks/useCategory";
import CategoryType from "../../../types/category";
import { modalStyle } from "../modalStyle";
import { selectStyle } from "../selectStyle";

// color
const color_options = [
  "#68FA14",
  "#2C41FA",
  "#FA7946",
  "#4EAD17",
  "#FA46CF",
  "#AD9417",
  "#0EADAB",
  "#FA412D",
  "#AD095D",
  "#90AD57"
]
// types (isEntry)
const category_types = [
  {label: "Entrada", value: true},
  {label: "Saida", value: false}
]
const category_type_default = category_types[0];

type props = {
  isOpen: boolean,
  closeModal: ()=> void,
  setCategories: Dispatch<React.SetStateAction<CategoryType[]>>,
}
const AddCategory = ({isOpen, closeModal, setCategories}: props) => {
  const { createCategory } = useCategory();
  // IDs
  const name_id = useId();
  const type_id = useId();
  const color_id = useId();

  const [categoryName, setCategoryName] = useState<string>("");
  const [isEntry, setIsEntry] = useState<boolean | undefined>(category_type_default.value);
  const [selectedColor, setSelectedColor] = useState<string>("");

  const [isCreating, setIsCreating] = useState<boolean>(false);

  const [error, setError] = useState<string>("");
  
  const sendForm = (e: FormEvent) => {
    e.preventDefault();

    if(categoryName.length < 3 || categoryName.length > 20){
      return setError("O nome da categoria deve ter entre 3 e 20 caracteres.");
    }
    if(isEntry === undefined){
      return setError("Selecione um tipo para sua categoria.");
    }
    if(!selectedColor || selectedColor.length === 0){
      return setError("Selecione alguma cor para a categoria.");
    }
    setError("");

    // cria categoria
    setIsCreating(true);
    createCategory(categoryName, isEntry, selectedColor)
    .then(res => {
      setCategories(res);
      
      // reset form
      setCategoryName("");
      setSelectedColor("");
      setIsEntry(category_type_default.value);

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
          <h2>Adicionar categoria</h2>
          <button onClick={() => closeModal()}><AiOutlineClose /></button>
        </div>
        <form className={styles.content} onSubmit={(e)=> sendForm(e)}>
          <label htmlFor={name_id}>Nome</label>
          <input 
            type="text" 
            id={name_id} 
            value={categoryName} 
            onChange={(e)=>setCategoryName(e.target.value)} 
          />

          <label htmlFor={type_id}>Tipo</label>
          <Select 
            defaultValue={category_type_default}
            options={category_types}
            styles={selectStyle}
            onChange={(value)=>setIsEntry(value?.value)}
          />

          <label htmlFor={color_id}>Cor</label>
          <div className={styles.colors_container}>
            {
              color_options.map(color => (
                <div 
                  key={color} 
                  className={selectedColor === color ? styles.color_active : styles.color} 
                  style={{backgroundColor: color}}
                  onClick={()=> setSelectedColor(color)}
                ></div>
              ))
            }
          </div>
          {
            error.length > 0 &&
            <p className={styles.error}>{error}</p>
          }
          {
            isCreating &&
            <p className={styles.loading}>Um momento, estamos criando esta categoria para você.</p>
          }
          <Submit value="Criar"/>
        </form>
      </Modal>
    </div>
  )
}
export default AddCategory;