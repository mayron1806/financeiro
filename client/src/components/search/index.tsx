import React, { Dispatch } from "react";
import {AiOutlineSearch} from "react-icons/ai";
import styles from "./search.module.css";
type props = {
  value: string,
  onchange: (e: HTMLInputElement) => void 
}
const Search = ({value, onchange}: props) => {
  return(
    <div className={styles.container}>
      <input 
        type="text" 
        placeholder="Pesquisar"
        value={value}
        onChange={(e)=> onchange(e.target)}
      />
      <AiOutlineSearch />
    </div>
  )
}
export default Search;