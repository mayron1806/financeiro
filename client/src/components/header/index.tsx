import styles from "./head.module.css";

type props = {
  title: string
}
const Header = ({title}: props) => {
  return(
    <header className={styles.head}>
      <h2 className={styles.title}>{title}</h2>
    </header>
  )
}
export default Header;