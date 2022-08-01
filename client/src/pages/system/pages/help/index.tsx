import Header from "../../../../components/header";
import pageStyle from "../pages.module.css";
import style from "./help.module.css";
import { Link } from "react-router-dom";
const Help = () => {
  return(
    <div>
      <Header title="Ajuda"/>
      <div className={pageStyle.content}>
        <p className={style.text}>
          O financeiro é um site para te ajudar na gestão financeira. 
          Ele possui 3 funções principais, são elas: categoria, transações 
          e transações agendadas.
        </p>
        <h4 className={style.title}><Link to="/category">Categorias</Link></h4>
        <p className={style.text}>
          As categorias são os "tipos" das transações, através delas você define
          se a sua transação é de entrada (adição de dinheiro na conta) ou saída 
          (saída de dinheiro da conta). Você pode criar diversas categorias, MAS 
          cada transações só pode ter uma categoria.<br />
          Exemplos de categoria: Entretenimento (saída), Renda extra (entrada).
        </p>
        <h4 className={style.title}>
          <Link to="/transations">Transações</Link>
        </h4>
        <p className={style.text}>
          As transações são a parte principal do site, elas definir o dinheiro que entra 
          e sai da sua conta. Nas transações você pode definir um nome (exemplo conta de água),
          valor (exemplo R$130,00), data (exemplo 01/08/2022), é principalmente a categoria, 
          através da categoria o financeiro vai saber se a transação é de entrada ou saída, 
          no caso da conta de água uma categoria poderia ser contas, despesas.<br />
          Exemplos de transações: cinema, conta de luz, salário, etc...
        </p>
        <h4 className={style.title}>
          <Link to="/schedule">Transações agendadas</Link>
          </h4>
        <p className={style.text}>
        Essa é uma funcionalidade muito útil do financeiro, com ela você pode agendar transações 
        para um dia específico, e também fazer elas repetirem um determinado número de meses, 
        ou se necessário infinitamente.
        Você pode usar as transações agendadas para gastos fixos que você tem no mês, 
        por exemplo netflix, ou caso você tenha comprado um celular novo e parcelado em 
        12 vezes, é possível agendar uma transação que se repete 12 meses.<br />
        Exemplos de transações agendadas: parcela do celular, aluguel, netflix, etc...
        </p>
      </div>
    </div>
  )
}
export default Help;