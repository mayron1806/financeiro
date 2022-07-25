import styles from "./table.module.css";
import { formatColorNumbers, formatMoney } from "../../utils/format";
import { BiEdit } from "react-icons/bi";
import { BsSafe } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import moment from "moment";
import CategoryType from "../../types/category";

type props = {
  categories: CategoryType[]
}
const CategoryTable = ({categories}: props) => {
  return(
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{textAlign: "left"}}>Nome</th>
            <th>Tipo</th>
            <th>Cor</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            categories.map(category =>{
              const {name, is_entry, color} = category;
              return(
                <tr key={name}>
                  <td style={{textAlign: "left"}}>{name}</td>
                  <td>{is_entry ? "Entrada" : "Saida"}</td>
                  <td className={styles.color} >
                    <div 
                      className={styles.color} 
                      style={{backgroundColor: color}}></div>
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
          categories.length < 1 &&
          <div className={styles.no_category}>
            <BsSafe />
            <p>Não há transações neste periodo.</p>
          </div>
        }
    </div>
    
  )
}
export default CategoryTable;