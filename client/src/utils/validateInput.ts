import React, { Dispatch } from "react";

const validateInput = (input: HTMLInputElement, name: string, setErrorMessage: Dispatch<React.SetStateAction<string>>) => {
  input.oninvalid = (e) => {
    e.preventDefault();

    input.classList.add("error");

    if(input.validity.tooShort) setErrorMessage(`O campo ${name.toLowerCase()} é muito curto.`);
    if(input.validity.tooLong) setErrorMessage(`O campo ${name.toLowerCase()} é muito longo.`);
    if(input.validity.valueMissing) setErrorMessage(`O campo ${name.toLowerCase()} está vazio.`);
  }
}
export default validateInput;