import React, { Dispatch, FormEvent, useEffect, useState } from "react";
import Submit from "../../../components/submit";
import {AiOutlineEyeInvisible, AiOutlineEye} from "react-icons/ai";
import "../style.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const SignUp = () => {
  const { signUp } = useAuth();

  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassowrd] = useState<boolean>(false);

  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showConfirmPassword, setShowConfirmPassowrd] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const sendForm = (e: FormEvent) => {
    e.preventDefault();
    if(name.length < 5 || name.length > 15){
      return setErrorMessage("O nome deve ter entre 5 e 15 caracteres.");
    }
    if(password.length < 5 || password.length > 20){
      return setErrorMessage("A senha deve ter entre 5 e 20 caracteres.");
    }
    if(password !== confirmPassword){
      return setErrorMessage("As senhas não coincidem.");
    }
    // cria conta
    const signup = async ()=>{
      const res = await signUp(name, password);
      if(res.status !== 201){
        return setErrorMessage(res.message);
      }
      navigate("/", {replace: true});
    }
    signup();
  }
  useEffect(()=>{
    setErrorMessage("");
  }, [name, password, confirmPassword])
  const renderEye = (show: boolean, setShow: Dispatch<React.SetStateAction<boolean>>) => {
    return (
      <div onClick={()=> setShow(!show)}>
        { show && <AiOutlineEye /> || <AiOutlineEyeInvisible /> }
      </div>
    ) 
  }
  return(
    <div className="container">
      <main>
        <div className="head">
          <h1 className="title">FINANCEIRO</h1>
          <p>Bem vindo ao financeiro!</p>
        </div>
        <form onSubmit={(e)=> sendForm(e)}>
          <div className="input">
            <label htmlFor="name">Nome</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e)=> setName(e.target.value)} 
              id="name"
            />
          </div>
          <div className="input">
            <label htmlFor="name">Senha</label>
            <input 
              type={showPassword ? "text" : "password"}
              value={password} 
              onChange={(e)=> setPassword(e.target.value)} 
              id="name"
              autoComplete="off"
            />
            {renderEye(showPassword, setShowPassowrd)}
          </div>
          <div className="input">
            <label htmlFor="name">Confirmar senha</label>
            <input 
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword} 
              onChange={(e)=> setConfirmPassword(e.target.value)} 
              id="name"
              autoComplete="off"
            />
            {renderEye(showConfirmPassword, setShowConfirmPassowrd)}
          </div>
          {
            errorMessage.length > 0 &&
            <p className="error-message">{errorMessage}</p>
          }
          <Submit value="Criar conta"/>
        </form>
        <p className="link">Já possui uma conta? <a href="/signin">Entrar</a></p>
      </main>
    </div>
  )
}
export default SignUp;