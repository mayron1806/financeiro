import React, { Dispatch, useId, useState, useRef, useEffect } from "react";
import {AiFillEyeInvisible, AiFillEye} from "react-icons/ai";
import validateInput from "../../../utils/validateInput";

import "../style.css";
import "./style.css";

type props = {
  name: string,
  value: string,
  setValue: Dispatch<React.SetStateAction<string>>,
  setErrorMessage:  Dispatch<React.SetStateAction<string>>,
  placeholder?: string, 
  required?: boolean,
  min?: number,
  max?: number
}
const InputPassword = ({name, placeholder, value, setValue, setErrorMessage, required}:props) => {
  const [isActive, setIsActive] = useState<boolean>();
  const id = useId(); 
  const ref = useRef<HTMLInputElement>(null);

  // validation
  useEffect(()=>{
    if(ref.current === null) return;
    validateInput(ref.current, name, setErrorMessage);
  }, [ref])
  
  const renderEye = () => {
    return (
      <div className="eye" 
        onClick={()=> setIsActive(active=> !active)}>
        {
          isActive &&
            <AiFillEyeInvisible/> 
          || 
            <AiFillEye/>
        }
      </div> 
    )
  }
  return(
    <div>
      <label htmlFor={id}>{name}</label>
      <div className="input">
        <input 
          ref={ref}
          type={isActive ? "text" : "password"}
          placeholder={placeholder} 
          id={id} 
          autoComplete="off"
          value={value}
          required={required}
          onChange={(e)=> setValue(e.target.value)}
        />
        {renderEye()}
      </div>
    </div>
  )
}
export default InputPassword;