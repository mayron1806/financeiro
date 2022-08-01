import styles from "./table.module.css";
import TransationType from "../../types/transation";
import { formatColorNumbers, formatMoney } from "../../utils/format";
import { BiEdit } from "react-icons/bi";
import { BsSafe } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import moment from "moment";
import { useContext, useState } from "react";
import UpdateTransation from "../modals/updateTransation";
import useTransation from "../../hooks/useTransation";
import ResultType from "../../types/result";
import Icon from "../../enum/iconType";
import ResultContext from "../../context/result";

type props = {
  transatios: TransationType[],
  onChange: () => void
}
const TransationTable = ({transatios, onChange}: props) => {
  const resultContext = useContext(ResultContext);

  const { deleteTransations } = useTransation();
  
  const [selectedTransation, setSelectedTransation] = useState<TransationType>();
  
  const [updateIsOpen, setUpdateIsOpen] = useState<boolean>(false);
  const openUpdateModal = () => setUpdateIsOpen(true); 
  const closeUpdateModal = () => setUpdateIsOpen(false); 

  const del = (transation: TransationType)=>{
    deleteTransations([transation])
    .then(res=>{
      onChange();
      const result: ResultType = {
        icon: Icon.SUCCESS,
        message: "Transação deletada com sucesso."
      };
      resultContext.set(result);
    })  
    .catch(error=>{
      const result: ResultType = {
        icon: Icon.SUCCESS,
        message: error.message
      };
      resultContext.set(result);
    })
  }
  
  return(
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{textAlign: "left"}}>Nome</th>
            <th>Valor</th>
            <th>Categoria</th>
            <th>Data da transação</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            transatios.map(transation =>{
              const {name, category, date, value, _id} = transation;
              return(
                <tr key={_id}>
                  <td style={{textAlign: "left"}}>{name}</td>
                  <td style={formatColorNumbers(value)}>{formatMoney(value)}</td>
                  <td>
                    <span 
                      className={styles.category} 
                      style={{backgroundColor: category.color}}
                    >{category.name}</span>
                  </td>
                  <td>{moment(date).add(1, "day").format("DD/MM/YYYY")}</td>
                  <td className={styles.icon}>
                    <BiEdit onClick={() => {
                      setSelectedTransation(transation);
                      openUpdateModal();
                    }} />
                  </td>
                  <td className={styles.icon}>
                    <AiOutlineClose onClick={()=> del(transation)}/>
                    </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
        {
          transatios.length < 1 &&
          <div className={styles.no_transations}>
            <BsSafe />
            <p>Não há categorias neste periodo.</p>
          </div>
        }
        {
          selectedTransation !== undefined &&
          <UpdateTransation 
            isOpen={updateIsOpen}
            closeModal={closeUpdateModal}
            transationToUpdate={selectedTransation}
            onUpdate={onChange}
          />
        }
    </div>
  )
}
export default TransationTable;