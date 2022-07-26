import styles from "./table.module.css";
import TransationType from "../../types/transation";
import { formatColorNumbers, formatMoney } from "../../utils/format";
import { BiEdit } from "react-icons/bi";
import { BsSafe } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import moment from "moment";

type props = {
  transatios: TransationType[]
}
const TransationTable = ({transatios}: props) => {
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
            transatios.map((transation, index) =>{
              const {name, category, date, value} = transation;
              return(
                <tr key={index}>
                  <td style={{textAlign: "left"}}>{name}</td>
                  <td style={formatColorNumbers(value)}>
                    {formatMoney(value)}
                  </td>
                  <td>
                    <span 
                      className={styles.category} 
                      style={{backgroundColor: category.color}}
                    >{category.name}</span>
                  </td>
                  <td>{moment(date).add(1, "d").format("DD/MM/YYYY")}</td>
                  <td className={styles.icon}><BiEdit /></td>
                  <td className={styles.icon}><AiOutlineClose /></td>
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
    </div>
    
  )
}
export default TransationTable;