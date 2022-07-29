import { useParams } from "react-router-dom";
import Category from "./pages/category";
import Home from "./pages/home";
import SideBar from "../../components/sidebar";
import styles from "./system.module.css";
import Transations from "./pages/transations";
import Schedule from "./pages/schedule";
import Help from "./pages/help";
const System = () => {
  const { tab } = useParams();

  const renderScreen = ()=>{
    switch(tab){
      case "home":
        return (<Home />);

      case "transations":
        return (<Transations />);

      case "schedule":
        return (<Schedule />);

      case "category":
        return (<Category />);

      case "help":
        return (<Help />);

      default:
        return (<Home />);
    }
  }
  return(
    <div className={styles.container}>
      <SideBar />
      <main className={styles.content}>
        {renderScreen()}
      </main>
    </div>
  )
}
export default System;