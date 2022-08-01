import { useContext, useEffect, useState } from "react";
import { BiAddToQueue } from "react-icons/bi";
import {FaFilter} from "react-icons/fa";
import Header from "../../../../components/header";
import AddTransation from "../../../../components/modals/addTransation";
import FilterTransation from "../../../../components/modals/filterTransation";
import Search from "../../../../components/search";
import TransationCount from "../../../../components/transationCount";
import TransationTable from "../../../../components/transationTable";
import ResultContext from "../../../../context/result";
import Icon from "../../../../enum/iconType";
import useTransation from "../../../../hooks/useTransation";
import ResultType from "../../../../types/result";
import TransationType from "../../../../types/transation";
import TransationFilterType from "../../../../types/transationFilter";
import pageStyle from "../pages.module.css";
import styles from "./transations.module.css";

const Transations = () => {

  const { getTransations } = useTransation();

  // modals 
  const [addIsOpen, setAddIsOpen] = useState<boolean>(false);
  const openAddModal = ()=> setAddIsOpen(true);
  const closeAddModal = ()=> setAddIsOpen(false);

  const [filterIsOpen, setFilterIsOpen] = useState<boolean>(false);
  const openFilterModal = () => setFilterIsOpen(true);
  const closeFilterModal = () => setFilterIsOpen(false);

  // transations
  const [transations, setTransations] = useState<TransationType[]>([]);

  // filter
  const [nameFilter, setNameFilter] = useState<string>("");
  const [filter, setFilter] = useState<TransationFilterType>({} as TransationFilterType);

  const fetchTransations = ()=>{
    const options = {...filter, name: nameFilter};

    // pega transações por filtro
    getTransations(options)
    .then(res => {
      setTransations(res);
    })
    .catch(error => {
      const result: ResultType = {
        icon: Icon.SUCCESS,
        message: error.message
      };
      useContext(ResultContext).set(result);
    })
  }
  useEffect(()=>{
    fetchTransations();
  }, [filter])

  const setFilterOptions = (options: TransationFilterType) => setFilter(options);
  
  return(
    <div>
    <Header title="Transações"/>
    <div className={pageStyle.content}>
      <div className={pageStyle.head}>
        <div className={styles.search}>
          <Search value={nameFilter} onchange={(e: HTMLInputElement) => setNameFilter(e.value)}/>
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
      <TransationTable transatios={transations} onChange={fetchTransations}/>
      <TransationCount transations={transations} />
    </div>
    {/* MODALS */}
    <AddTransation 
      isOpen={addIsOpen} 
      closeModal={closeAddModal} 
      onAdd={fetchTransations}
    />
    <FilterTransation 
      isOpen={filterIsOpen} 
      closeModal={closeFilterModal} 
      setFilterOptions={setFilterOptions}
    />
    {/* END MODALS */}
  </div>
  )
}
export default Transations;