import React, { Dispatch, FormEvent, useEffect, useState } from "react";
import Submit from "../../../components/submit";
import {AiOutlineEyeInvisible, AiOutlineEye} from "react-icons/ai";
import styles from "../auth.module.css";
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
      navigate("/home", {replace: true});
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
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.head}>
          <h1 className={styles.title}>FINANCEIRO</h1>
          <p className={styles.sub_title}>Bem vindo ao financeiro!</p>
        </div>
        <form onSubmit={(e)=> sendForm(e)}>
          <div className={styles.input}>
            <label htmlFor="name">Nome</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e)=> setName(e.target.value)} 
              id="name"
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="password">Senha</label>
            <input 
              type={showPassword ? "text" : "password"}
              value={password} 
              onChange={(e)=> setPassword(e.target.value)} 
              id="password"
              autoComplete="off"
            />
            {renderEye(showPassword, setShowPassowrd)}
          </div>
          <div className={styles.input}>
            <label htmlFor="confirm-password">Confirmar senha</label>
            <input 
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword} 
              onChange={(e)=> setConfirmPassword(e.target.value)} 
              id="confirm-password"
              autoComplete="off"
            />
            {renderEye(showConfirmPassword, setShowConfirmPassowrd)}
          </div>
          {
            errorMessage.length > 0 &&
            <p className={styles.error_message}>{errorMessage}</p>
          }
          <Submit value="Criar conta"/>
        </form>
        <p className={styles.link}>Já possui uma conta? <a href="/signin">Entrar</a></p>
      </main>
    </div>
  )
}
export default SignUp;