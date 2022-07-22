import { useParams } from "react-router-dom";
import Home from "../../components/home";
import SideBar from "../../components/sidebar";
import styles from "./system.module.css";
const System = () => {
  const { tab } = useParams();

  const renderScreen = ()=>{
    switch(tab){
      case "home":
        return (<Home />);

      case "transations":
        return (<div></div>);

      case "schedule":
        return (<div></div>);

      case "category":
        return (<div></div>);

      default:
        return (<div></div>);
    }
  }
  return(
    <div className={styles.container}>
      <SideBar tab={tab}/>
      <main className={styles.content}>
        {renderScreen()}
      </main>
    </div>
  )
}
export default System;