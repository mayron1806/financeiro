import { useEffect, useState } from "react";
import { BiAddToQueue } from "react-icons/bi";
import Header from "../../../../components/header";
import AddTransation from "../../../../components/modals/addTransation";
import TransationTable from "../../../../components/transationTable";
import useAuth from "../../../../hooks/useAuth";
import useTransation from "../../../../hooks/useTransation";
import TransationType from "../../../../types/transation";
import pageStyle from "../pages.module.css";
import styles from "./transations.module.css";

const Transations = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const openModal = ()=> setIsOpen(true);
  const closeModal = ()=> setIsOpen(false);
  const [transations, setTransations] = useState<TransationType[]>([]);

  const {authContext} = useAuth();
  const { getAllTransations } = useTransation(authContext.user?.id);

  useEffect(()=>{
    getAllTransations()
    .then(res => {
      setTransations(res);
    })
    .catch(error=>{
      console.log(error);
    })
  }, [])
  return(
    <div>
    <Header title="Transações"/>
    <div className={pageStyle.content}>
      <div className={pageStyle.head}>
        <h3>Transações</h3>
        <button 
          className={pageStyle.button}
          onClick={()=> openModal()}
        >Criar <BiAddToQueue /></button>
      </div>
      <TransationTable transatios={transations}/>
    </div>
    {/* MODAL */}
    <AddTransation isOpen={isOpen} closeModal={closeModal} setTransations={setTransations}/>
    {/* END MODAL */}
  </div>
  )
}
export default Transations;