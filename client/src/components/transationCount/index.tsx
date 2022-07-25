import { useEffect } from "react";
import TransationType from "../../types/transation";
import { formatColorNumbers, formatMoney } from "../../utils/format";
import styles from "./count.module.css";

type props = {
  transations: TransationType[]
}

const getTransationsSum = (transations: TransationType[]) => {
  let sum = 0;
  transations.forEach(transation => {
    sum += transation.value;
  });
  return sum;
}

const TransationCount = ({transations}: props) => {
  const entry_sum = getTransationsSum(transations.filter(t=> t.category.is_entry));
  const exit_sum = getTransationsSum(transations.filter(t=> !t.category.is_entry));

  const total = entry_sum + exit_sum;

  return(
    <div className={styles.container}>
      <div className={styles.sum}>
        Entrada: 
        <span 
          style={formatColorNumbers(entry_sum)} 
          className={styles.money}  
        >{formatMoney(entry_sum)}</span>
      </div>
      <span>|</span>
      <div className={styles.sum}>
        Saida: 
        <span 
          style={formatColorNumbers(exit_sum)} 
          className={styles.money}  
        >{formatMoney(exit_sum)}</span>
      </div>
      <span>|</span>
      <div className={styles.sum}>
        Total: 
        <span 
          style={formatColorNumbers(total)}
          className={styles.money}  
        >{formatMoney(total)}</span>
      </div>
    </div>
  )
}
export default TransationCount;