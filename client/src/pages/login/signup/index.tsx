import { FormEvent, useState } from "react";
import InputPassword from "../../../components/input/password";
import InputText from "../../../components/input/text";
import Submit from "../../../components/submit";

import "../style.css";

const SignUp = () => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const sendForm = (e: FormEvent) => {
    e.preventDefault();
  }
  return(
    <div className="container">
      <main>
        <div className="head">
          <h1 className="title">FINANCEIRO</h1>
          <p>Bem vindo ao financeiro!</p>
        </div>
        <form onSubmit={(e)=> sendForm(e)}>
          <InputText 
            name="Nome:"
            value={name}
            setValue={setName}
          />
          <InputPassword 
            name="Senha:"
            value={password}
            setValue={setPassword}
          />
          <InputPassword 
            name="Confirmar senha:"
            value={confirmPassword}
            setValue={setConfirmPassword}
          />
          <Submit value="Criar conta"/>
        </form>
        <p className="link">Já possui uma conta? <a href="/signin">Entrar</a></p>
      </main>
    </div>
  )
}
export default SignUp;