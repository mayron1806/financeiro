import { useState } from "react";
import InputPassword from "../../../components/input/password";
import InputText from "../../../components/input/text";
import Submit from "../../../components/submit";

import "../style.css";

const SignIn = () => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState<string>("");
  return(
    <div className="container">
      <main>
        <div className="head">
          <h1 className="title">FINANCEIRO</h1>
          <p>Bem vindo de volta!</p>
        </div>
        <form>
          <InputText 
            name="Nome" 
            value={name} 
            setValue={setName}
            required
            setErrorMessage={setError}
          />
          <InputPassword 
            name="Senha" 
            value={password} 
            setValue={setPassword}
            required
            setErrorMessage={setError}
          />
          <Submit value="Entrar"/>
          {
            error.length > 0 &&
            <p className="error-message">{error}</p>
          }
        </form>
        <p className="link">Ainda não possui uma conta? <a href="/signup">Criar conta</a></p>
      </main>
    </div>
  )
}
export default SignIn;