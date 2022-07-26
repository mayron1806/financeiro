import styles from "../modal.module.css";
import Modal from "react-modal";
import CategoryType from "../../../types/category";
import { modalStyle } from "../modalStyle";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import { selectStyle } from "../selectStyle";
import { FormEvent, useId, useState } from "react";
import moment, { Moment } from "moment";
import Submit from "../../submit";

type props = {
  isOpen: boolean,
  closeModal: ()=> void,
  categories: CategoryType[],
  setFilterOptions: (categories: CategoryType[], min_date: Moment | undefined, max_date: Moment | undefined, value: number | undefined) => void
}
const FilterTransation = ({isOpen, closeModal, categories, setFilterOptions}: props) => {
  const category_id = useId();
  const value_id = useId();
  const date_id = useId();

  const [filterCategories, setFilterCategories] = useState<CategoryType[]>([]);
  const [filterValue, setFilterValue] = useState<number>(0);
  const [filterMinDate, setFilterMinDate] = useState<Moment>();
  const [filterMaxDate, setFilterMaxDate] = useState<Moment>();

  const sendForm = (e: FormEvent)=>{
    e.preventDefault();
    setFilterOptions(filterCategories, filterMinDate, filterMaxDate, filterValue);
    closeModal();
  }
  return(
    <div>
      <Modal
        ariaHideApp={false}
        isOpen={isOpen}
        style={modalStyle}
      >
        <div className={styles.head}>
          <h2>Filtros</h2>
          <button onClick={() => closeModal()}><AiOutlineClose /></button>
        </div>
        <form onSubmit={(e)=> sendForm(e)} className={styles.content}>
          <label htmlFor={category_id}>Categorias:</label>
          <Select 
            id={category_id}
            defaultValue={filterCategories.map(category => ({label: category.name, value: category}))}
            options={categories.map(category => ({label: category.name, value: category}))}
            styles={selectStyle}
            isMulti
            onChange={(selects)=> setFilterCategories(selects.map(item => item.value))}
          />
          <label htmlFor={value_id}>Valor(R$):</label>
          <input 
            type="number" 
            id={value_id} 
            step="0.01"
            value={filterValue}
            onChange={(e)=> setFilterValue(parseFloat(e.target.value))}
          />
          <label htmlFor={date_id}>Data:</label>
          <div>
            De: 
            <input 
              type="date" 
              max={moment().format("YYYY-MM-DD")}
              value={filterMinDate ? moment(filterMinDate).format("YYYY-MM-DD") : undefined}
              onChange={(e)=> setFilterMinDate(moment(e.target.value))}
            />
          </div>
          <div>
            Ate: 
            <input 
              type="date" 
              max={moment().format("YYYY-MM-DD")}
              value={filterMaxDate ? moment(filterMaxDate).format("YYYY-MM-DD") : undefined}
              onChange={(e)=> setFilterMaxDate(moment(e.target.value))}
            />
          </div>
          <Submit value="Filtrar"/>
        </form>
      </Modal>
    </div>
  )
}
export default FilterTransation;