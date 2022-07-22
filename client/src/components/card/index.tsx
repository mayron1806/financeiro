import styles from "./card.module.css";
import {
  formatColorNumbers, 
  formatMoney
} from "../../utils/format";

type props = {
  title: string,
  money: number,
  children: JSX.Element
}

const Card = ({title, money, children}: props) => {
  return(
    <div className={styles.container}>
      <p className={styles.title}>{title}</p>
      <div className={styles.content}>
        {children}
        <p 
          className={styles.money} 
          style={formatColorNumbers(money)}
        >{formatMoney(money)}</p>
      </div>
    </div>
  )
}
export default Card;