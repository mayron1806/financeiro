import React, { Dispatch, useEffect, useId, useRef } from "react";
import validateInput from "../../../utils/validateInput";
import "../style.css";
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
const InputText = ({name, placeholder, value, setValue, setErrorMessage, required, min, max} : props) => {
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  // validation
  useEffect(()=>{
    if(ref.current === null) return;
    validateInput(ref.current, name, setErrorMessage);
  }, [ref])

  return(
    <div>
      <label htmlFor={id}>{name}</label>
      <input 
        ref={ref}
        type="text"
        placeholder={placeholder} 
        id={id} 
        required={required}
        autoComplete="off"
        value={value}
        onChange={(e)=> setValue(e.target.value)}
        min={min}
        max={max}
      />
    </div>
  )
}
export default InputText;