import styles from "./submit.module.css";

type props = {
  value: string
}
const Submit = ({value} : props) => {
  return <input className={styles.submit} type="submit" value={value}/>
}
export default Submit;