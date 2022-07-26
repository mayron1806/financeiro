import { CSSProperties } from "react";
import styles from "./submit.module.css";

type props = {
  value: string,
  style?: CSSProperties
}
const Submit = ({value, style} : props) => {
  return <input style={style} className={styles.submit} type="submit" value={value}/>
}
export default Submit;