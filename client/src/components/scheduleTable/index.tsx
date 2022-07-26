import moment from "moment";
import { AiOutlineClose } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { BsSafe } from "react-icons/bs";
import ScheduleTransationType from "../../types/scheduleTransations";
import { formatColorNumbers, formatMoney } from "../../utils/format";
import styles from "./schedule.module.css";


type props = {
  transatios: ScheduleTransationType[]
}
const ScheduleTable = ({transatios}: props) => {
  return(
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{textAlign: "left"}}>Nome</th>
            <th>Valor</th>
            <th>Categoria</th>
            <th>Proxima transação</th>
            <th>N° repetições</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            transatios.map((transation, index) =>{
              const {name, category, value, execution} = transation;
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
                  <td>{moment(execution.next_date).add(1, "d").format("DD/MM/YYYY")}</td>
                  <td>
                    {
                      execution.max &&
                        (execution.count + "/" + execution.max)
                      ||
                        <p>Infinito</p>
                    }
                  </td>
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
          <p>Ainda não foram adicionadas transações.</p>
        </div>
      }
    </div>
  )
}
export default ScheduleTable;