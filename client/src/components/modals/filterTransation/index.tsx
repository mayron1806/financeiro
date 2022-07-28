import styles from "../modal.module.css";
import Modal from "react-modal";
import CategoryType from "../../../types/category";
import { modalStyle } from "../modalStyle";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import { selectStyle } from "../selectStyle";
import { FormEvent, useEffect, useId, useState } from "react";
import moment, { Moment } from "moment";
import Submit from "../../submit";
import useCategory from "../../../hooks/useCategory";
import TransationFilterType from "../../../types/transationFilter";

type props = {
  isOpen: boolean,
  closeModal: ()=> void,
  setFilterOptions: (options: TransationFilterType) => void
}
const FilterTransation = ({isOpen, closeModal, setFilterOptions}: props) => {
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
  
  // IDs
  const category_id = useId();
  const value_id = useId();
  const date_id = useId();
  
  // filter
  const [filterCategories, setFilterCategories] = useState<CategoryType[]>([]);
  const [filterValue, setFilterValue] = useState<number>(0);
  const [filterMinDate, setFilterMinDate] = useState<Moment>();
  const [filterMaxDate, setFilterMaxDate] = useState<Moment>();

  const sendForm = (e: FormEvent)=>{
    e.preventDefault();

    const options: TransationFilterType = {};

    if(filterValue && filterValue !== 0) options.value = filterValue;
    if(filterCategories && filterCategories.length > 0) options.categories = filterCategories;
    if(filterMinDate && filterMinDate.isValid()) options.min_date = filterMinDate;
    if(filterMaxDate && filterMaxDate.isValid()) options.max_date = filterMaxDate;

    setFilterOptions(options);
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
            options={categories.map(category => ({label: category.name, value: category}))}
            styles={selectStyle}
            isMulti
            value={filterCategories.map(category => ({label: category.name, value: category}))}
            onChange={(selects)=> setFilterCategories(selects.map(item => item.value))}
          />
          <label htmlFor={value_id}>Valor(R$):</label>
          <input 
            type="number" 
            id={value_id} 
            step="0.01"
            value={filterValue}
            onChange={(e)=> setFilterValue(parseFloat(e.target.value ?? 0))}
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