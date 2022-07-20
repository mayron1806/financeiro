import { Dispatch, FormEvent, useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import Submit from "../../../components/submit";
import useAuth from "../../../hooks/useAuth";

import "../style.css";

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
      navigate("/", {replace: true});
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
    <div className="container">
      <main>
        <div className="head">
          <h1 className="title">FINANCEIRO</h1>
          <p>Bem vindo de volta!</p>
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
              id="password"
              autoComplete="off"
            />
            {renderEye(showPassword, setShowPassowrd)}
          </div>
          {
            errorMessage.length > 0 &&
            <p className="error-message">{errorMessage}</p>
          }
          <Submit value="Criar conta"/>
        </form>
        <p className="link">Ainda não tem uma conta? <a href="/signup">Criar agora</a></p>
      </main>
    </div>
  )
}
export default SignIn;