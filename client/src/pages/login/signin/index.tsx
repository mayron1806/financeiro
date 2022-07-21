import { Dispatch, FormEvent, useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Submit from "../../../components/submit";
import useAuth from "../../../hooks/useAuth";

import styles from "../auth.module.css";


const SignIn = () => {
  const navigate = useNavigate();
  const {signIn} = useAuth();
  const [name, setName] = useState<string>("");
  
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassowrd] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const sendForm = (e: FormEvent) => {
    e.preventDefault();
    if(name.length < 5 || name.length > 15){
      return setErrorMessage("O nome deve ter entre 5 e 15 caracteres.");
    }
    if(password.length < 5 || password.length > 20){
      return setErrorMessage("A senha deve ter entre 5 e 20 caracteres.");
    }
    const login = async ()=>{
      const res = await signIn(name, password);
      
      if(res.status !== 200){
        return setErrorMessage(res.message);
      }
      navigate("/home", {replace: true});
      console.log(res);
    }
    login();
  }

  useEffect(()=>{
    setErrorMessage("");
  }, [name, password])

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
          <p className={styles.sub_title}>Bem vindo de volta!</p>
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
            <label htmlFor="name">Senha</label>
            <input 
              type={showPassword ? "text" : "password"}
              value={password} 
              onChange={(e)=> setPassword(e.target.value)} 
              id="password"
              autoComplete="off"
            />
            {renderEye(showPassword, setShowPassowrd)}
          </div>
          {
            errorMessage.length > 0 &&
            <p className={styles.error_message}>{errorMessage}</p>
          }
          <Submit value="Entrar"/>
        </form>
        <p className={styles.link}>Ainda não tem uma conta? <a href="/signup">Criar agora</a></p>
      </main>
    </div>
  )
}
export default SignIn;