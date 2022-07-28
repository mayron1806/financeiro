import styles from "./sidebar.module.css";
import {FiLogOut} from "react-icons/fi";
import {AiFillHome, AiFillSchedule} from "react-icons/ai";
import {MdOutlineAttachMoney, MdCategory} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

type props = {
  tab: string | undefined
}
const SideBar = ({ tab }: props) => {
  const navegate = useNavigate();
  const { signOut, authContext } = useAuth();

  const isActiveMenu = (name: string) => {
    if(name === tab) return styles.active;
  }

  const logout = () => {
    signOut();
    navegate("/signin");
  }
  return(
    <div className={styles.container}>
      <div>
        <div>
          <h1 className={styles.title}>FINANCEIRO</h1>
        </div>
        <div>
          <ul className={styles.menu}>
            <li className={isActiveMenu("home")}>
              <Link to={"/home"}>
                <AiFillHome />
                Inicio
              </Link>
            </li>
            <li className={isActiveMenu("transations")}>
              <Link to={"/transations"}>
                <MdOutlineAttachMoney />
                Transações
              </Link>
            </li>
            <li className={isActiveMenu("schedule")}>
              <Link to={"/schedule"}>
                <AiFillSchedule />
                Agendar
              </Link>
            </li>
            <li className={isActiveMenu("category")}>
              <Link to={"/category"}>
                <MdCategory />
                Categorias
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <footer className={styles.footer}>
        <p>{authContext.user?.name}</p>
        <FiLogOut onClick={()=> logout()}/>
      </footer>
    </div>
  )
}
export default SideBar;