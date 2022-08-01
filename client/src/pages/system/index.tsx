import { useParams } from "react-router-dom";
import Category from "./pages/category";
import Home from "./pages/home";
import SideBar from "../../components/sidebar";
import styles from "./system.module.css";
import Transations from "./pages/transations";
import Schedule from "./pages/schedule";
import Help from "./pages/help";
import ResultMessage from "../../components/resultMessage";
import ResultContext from "../../context/result";
import { useEffect, useState } from "react";
import ResultType from "../../types/result";
import Icon from "../../enum/iconType";

const wellcomeMessage : ResultType = {
  icon: Icon.SUCCESS,
  message: "Seja bem vindo ao financeiro."
}
const System = () => {
  const [result, setResult] = useState<ResultType>(wellcomeMessage);
  const [showResult, setShowResult] = useState<boolean>(true);
  useEffect(() => {
    if(result){
      setShowResult(true);
      setTimeout(()=>{
        setShowResult(false);
      }, 5 * 1000);
    }
  }, [result])
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
      <ResultContext.Provider value={{set: setResult}}>
        <SideBar />
        <main className={styles.content}>
          {renderScreen()}
        </main>
        <div className={styles.message}>
          <ResultMessage type={result.icon} message={result.message} show={showResult}/>
        </div>
      </ResultContext.Provider>
    </div>
  )
}
export default System;