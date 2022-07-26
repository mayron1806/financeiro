import { Moment } from "moment";
import { useEffect, useState } from "react";
import { BiAddToQueue } from "react-icons/bi";
import {FaFilter} from "react-icons/fa";
import Header from "../../../../components/header";
import AddTransation from "../../../../components/modals/addTransation";
import FilterTransation from "../../../../components/modals/filterTransation";
import Search from "../../../../components/search";
import TransationCount from "../../../../components/transationCount";
import TransationTable from "../../../../components/transationTable";
import useAuth from "../../../../hooks/useAuth";
import useCategory from "../../../../hooks/useCategory";
import useTransation from "../../../../hooks/useTransation";
import CategoryType from "../../../../types/category";
import TransationType from "../../../../types/transation";
import TransationFilterType from "../../../../types/transationFilter";
import pageStyle from "../pages.module.css";
import styles from "./transations.module.css";

const Transations = () => {
  // modals 
  const [addIsOpen, setAddIsOpen] = useState<boolean>(false);
  const openAddModal = ()=> setAddIsOpen(true);
  const closeAddModal = ()=> setAddIsOpen(false);

  const [filterIsOpen, setFilterIsOpen] = useState<boolean>(false);
  const openFilterModal = () => setFilterIsOpen(true);
  const closeFilterModal = () => setFilterIsOpen(false);

  const [transations, setTransations] = useState<TransationType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  // db
  const { getFilteredTransations } = useTransation();
  const { getCategories } = useCategory();

  // filter
  const [nameFilter, setNameFilter] = useState<string>("");
  const [valueFilter, setValueFilter] = useState<number>();
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [minDateFilter, setMinDateFilter] = useState<Moment>();
  const [maxDateFilter, setMaxDateFilter] = useState<Moment>();

  const [needUpdate, setNeedUpdate] = useState<boolean>(true);

  useEffect(()=>{
    if(!needUpdate) return;
    const options: TransationFilterType = {};

    if(nameFilter && nameFilter.length > 0) options.name = nameFilter;
    if(valueFilter && valueFilter !== 0) options.value = valueFilter;
    if(categoryFilter && categoryFilter.length > 0) options.categories = categoryFilter;
    if(minDateFilter && minDateFilter.isValid()) options.min_date = minDateFilter;
    if(maxDateFilter && maxDateFilter.isValid()) options.max_date = maxDateFilter;
    
    // pega transações
    getFilteredTransations(options)
    .then(res => {
      setTransations(res);
    })
    .catch(error=>{
      console.log(error);
    })
    .finally(()=>{
      setNeedUpdate(false);
    })
  }, [nameFilter, valueFilter, categoryFilter, minDateFilter, maxDateFilter, needUpdate])

  // pega categorias
  useEffect(()=>{
    getCategories()
    .then(res => {
      setCategories(res);
    })
    .catch(error => {
      console.log(error);
    });
  }, [])

  const setFilterOptions = (
    categories: CategoryType[], 
    min_date: Moment | undefined, 
    max_date: Moment | undefined, 
    value: number | undefined
    ) => {
      setCategoryFilter(categories.map(category=> category._id ?? ""));
      setMinDateFilter(min_date);
      setMaxDateFilter(max_date);
      setValueFilter(value);
      
      setNeedUpdate(true);
  }

  const updateNameFilter = (e: HTMLInputElement) => {
    setNameFilter(e.value);
    setNeedUpdate(true);
  }
  return(
    <div>
    <Header title="Transações"/>
    <div className={pageStyle.content}>
      <div className={pageStyle.head}>
        <div className={styles.search}>
          <Search value={nameFilter} onchange={updateNameFilter}/>
          <button 
            className={pageStyle.button} 
            onClick={()=> openFilterModal()}
            style={{backgroundColor: "var(--gray)"}}
          >Filtrar <FaFilter />
          </button>
        </div>
        <button 
          className={pageStyle.button}
          onClick={()=> openAddModal()}
        >Criar <BiAddToQueue /></button>
      </div>
      <TransationTable transatios={transations}/>
      <TransationCount transations={transations}/>
    </div>
    {/* MODALS */}
    <AddTransation 
      isOpen={addIsOpen} 
      closeModal={closeAddModal} 
      categories={categories}
    />
    <FilterTransation 
      setFilterOptions={setFilterOptions}
      isOpen={filterIsOpen} 
      closeModal={closeFilterModal} 
      categories={categories}
    />
    {/* END MODALS */}

  </div>
  )
}
export default Transations;