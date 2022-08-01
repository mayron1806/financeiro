import styles from "../modal.module.css";
import Modal from "react-modal";

import {modalStyle} from "../modalStyle";
import { selectStyle } from "../selectStyle";
import { AiOutlineClose } from "react-icons/ai";
import CategoryType from "../../../types/category";
import { FormEvent, useContext, useEffect, useId, useState } from "react";
import Select from "react-select";
import color_options from "../../../style/colorOptions";
import Submit from "../../submit";
import useCategory from "../../../hooks/useCategory";
import CategoryUpdateType from "../../../types/categoryUpdate";
import ResultType from "../../../types/result";
import ResultContext from "../../../context/result";
import Icon from "../../../enum/iconType";

type props = {
  isOpen: boolean,
  closeModal: ()=> void,
  onUpdate: ()=> void,
  categoryToUpdate: CategoryType 
}
const  UpdateCategory = ({isOpen, closeModal, onUpdate, categoryToUpdate}: props) => {
  const resultContext = useContext(ResultContext);
  
  const { updateCategory } = useCategory();

  const name_id = useId();
  const type_id = useId();
  const color_id = useId();
  
  const [categoryName, setCategoryName] = useState<string>(categoryToUpdate.name);
  const [categoryColor, setCategoryColor] = useState<string>(categoryToUpdate.color);
  const [categoryIsEntry, setCategoryIsEntry] = useState<boolean>(categoryToUpdate.is_entry);

  // quando a categoria para atuazização mudar, os states serão atualizados
  useEffect(()=>{
    setCategoryName(categoryToUpdate.name);
    setCategoryIsEntry(categoryToUpdate.is_entry);
    setCategoryColor(categoryToUpdate.color);
  }, [categoryToUpdate]);

  const [error, setError] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const sendForm = (e: FormEvent) => {
    

    e.preventDefault();
    const id = categoryToUpdate._id;
    
    if(!id) return setError("Categoria não selecionada, tente novamente.");
    if(categoryName.length < 3 || categoryName.length > 20) return setError("O nome da categoria deve ter entre 3 e 20 caracteres.");
    if(categoryColor.length === 0) return setError("Você precisa definir uma cor para sua categoria.");

    setError("");
    setIsUpdating(true);  
    // verifica se foram alterados os dados, se sim recebe o valor atualizado, se não recebe undefined
    const name = categoryName === categoryToUpdate.name ? undefined : categoryName;
    const is_entry = categoryIsEntry === categoryToUpdate.is_entry ? undefined : categoryIsEntry;
    const color = categoryColor === categoryToUpdate.color ? undefined : categoryColor;
   
    const options : CategoryUpdateType = {
      _id: id,
      name, 
      is_entry, 
      color
    }
    updateCategory(options)
    .then(() => { 
      const result: ResultType = {
        icon: Icon.SUCCESS,
        message: "Categoria atualizada com sucesso."
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
          <h2>Atualizar categoria</h2>
          <button onClick={() => closeModal()}><AiOutlineClose /></button>
        </div>
        <form className={styles.content} onSubmit={(e)=> sendForm(e)}>
          <label htmlFor={name_id}>Nome</label>
          <input 
            type="text" 
            id={name_id} 
            value={categoryName} 
            onChange={(e)=> setCategoryName(e.target.value)} 
          />

          <label htmlFor={type_id}>Tipo</label>
          <Select 
            options={[{ label: "Entrada", value: true }, { label: "Saida", value: false }]}
            styles={selectStyle}
            value={{ label: categoryIsEntry ? "Entrada" : "Saida", value: categoryIsEntry }}
            onChange={(value) => setCategoryIsEntry(value?.value || false)}
          />

          <label htmlFor={color_id}>Cor</label>
          <div className={styles.colors_container}>
            {
              color_options.map(color => (
                <div 
                  key={color} 
                  className={categoryColor === color ? styles.color_active : styles.color} 
                  style={{backgroundColor: color}}
                  onClick={() => setCategoryColor(color)}
                ></div>
              ))
            }
          </div>
          {
            error.length > 0 &&
            <p className={styles.error}>{error}</p>
          }
          {
            isUpdating &&
            <p className={styles.loading}>Um momento, estamos atualizando está categoria para você..</p>
          }
          <Submit value="Atualizar"/>
        </form>
      </Modal>
    </div>
  )
}
export default UpdateCategory;