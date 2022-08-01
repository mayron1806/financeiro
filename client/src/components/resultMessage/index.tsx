import { CSSProperties, useEffect, useRef, useState } from "react";
import { AiOutlineCheckCircle, AiOutlineWarning } from "react-icons/ai";
import { BiErrorAlt } from "react-icons/bi";
import Icon from "../../enum/iconType";
import styles from "./result.module.css";

type props = {
  type: Icon,
  message: string,
  show: boolean
}
const ResultMessage = ({type, message, show}: props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(()=>{
    if(typeof(show) === "boolean"){
      if(show){
        containerRef.current?.classList.remove(styles.hide);
        containerRef.current?.classList.add(styles.show);
      }
      else if (!show){
        containerRef.current?.classList.remove(styles.show);
        containerRef.current?.classList.add(styles.hide);
      }
    }
  }, [show]);
  
  const style = () : CSSProperties => {
    switch(type){
      case Icon.ERROR:
        return {color: "var(--red)"};
      case Icon.WAITING:
        return {color: "var(--yellow)"};
      case Icon.SUCCESS:
        return {color: "var(--green)"};
      default:
        return {color: "var(--gray)"};
    }
  }
  const icon = ()=>{
    switch(type){
      case Icon.ERROR:
        return <BiErrorAlt />
      case Icon.WAITING:
        return <AiOutlineWarning />
      case Icon.SUCCESS:
        return <AiOutlineCheckCircle />
    }
  }

  return(
    <div ref={containerRef} className={styles.container} style={style()}>
      <div 
        className={styles.icon}
      >{icon()}</div>
      <p 
        className={styles.message}
      >{message}</p>
    </div>
  )
}
export default ResultMessage;