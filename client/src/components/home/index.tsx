import Card from "../card";
import Header from "../header";
import {GiMoneyStack} from "react-icons/gi";
import {BiCalendar, BiEdit} from "react-icons/bi";
import {AiOutlineClose} from "react-icons/ai";
import styles from "./home.module.css";
import Select, { CSSObjectWithLabel } from "react-select";
import { useState } from "react";
import { formatColorNegativeNumber, formatMoney } from "../../utils/format";

// filter options
const options = [
  {label: "Ultimos 7 dias", value: 7},
  {label: "Ultimos 15 dias", value: 15},
  {label: "Ultimos 30 dias", value: 30}
]
const selectStyle = {
  control: (styles : CSSObjectWithLabel) => ({
    ...styles, 
    backgroundColor: "transparent",
    border: "1px solid var(--white)"
  }),
  menu: (styles: CSSObjectWithLabel)=>({
    ...styles, backgroundColor: "var(--black)"
  }), 
  option: (styles: CSSObjectWithLabel)=>({
    ...styles, backgroundColor: "var(--black)", color:"var(--white)"
  }),
  singleValue: (styles: CSSObjectWithLabel)=>({
    ...styles, color: "var(--white)"
  })
}

const Home = () => {
  const [transationFilter, setTransationFilter] = useState<number | undefined>(7);
  return(
    <div>
      <Header title="Inicio"/>
      <div className={styles.content}>
        <div className={styles.cards}>
          <Card money={1000.02} title={"Balanço total"}>
            <GiMoneyStack />
          </Card>
          <Card money={-1000.02} title={"Balanço mensal"}>
            <BiCalendar />
          </Card>
        </div>
        <div className={styles.transations}>
          <div className={styles.head}>
            <h3>Transações</h3>
            <Select 
              defaultValue={options[0]} 
              options={options}
              onChange={(value) => setTransationFilter(value?.value)}
              styles={selectStyle}
            />
          </div>
          <div className={styles.table_container}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{textAlign: "left"}}>Nome</th>
                  <th>Valor</th>
                  <th>Categoria</th>
                  <th>Data da transação</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{textAlign: "left"}}>Transação 1</td>
                  <td style={formatColorNegativeNumber(-500)}>
                    {formatMoney(-500)}
                  </td>
                  <td>
                    <span className={styles.category}>
                      Categoria 1
                    </span>
                  </td>
                  <td>20/07/2022</td>
                  <td className={styles.icon}><BiEdit /></td>
                  <td className={styles.icon}><AiOutlineClose /></td>
                </tr>
                <tr>
                  <td style={{textAlign: "left"}}>Transação 1</td>
                  <td style={formatColorNegativeNumber(-500)}>
                    {formatMoney(-500)}
                  </td>
                  <td>
                    <span className={styles.category}>
                      Categoria 1
                    </span>
                  </td>
                  <td>20/07/2022</td>
                  <td className={styles.icon}><BiEdit /></td>
                  <td className={styles.icon}><AiOutlineClose /></td>
                </tr>
                <tr>
                  <td style={{textAlign: "left"}}>Transação 1</td>
                  <td style={formatColorNegativeNumber(-500)}>
                    {formatMoney(-500)}
                  </td>
                  <td>
                    <span className={styles.category}>
                      Categoria 1
                    </span>
                  </td>
                  <td>20/07/2022</td>
                  <td className={styles.icon}><BiEdit /></td>
                  <td className={styles.icon}><AiOutlineClose /></td>
                </tr>
                <tr>
                  <td style={{textAlign: "left"}}>Transação 1</td>
                  <td style={formatColorNegativeNumber(-500)}>
                    {formatMoney(-500)}
                  </td>
                  <td>
                    <span className={styles.category}>
                      Categoria 1
                    </span>
                  </td>
                  <td>20/07/2022</td>
                  <td className={styles.icon}><BiEdit /></td>
                  <td className={styles.icon}><AiOutlineClose /></td>
                </tr>
                <tr>
                  <td style={{textAlign: "left"}}>Transação 1</td>
                  <td style={formatColorNegativeNumber(-500)}>
                    {formatMoney(-500)}
                  </td>
                  <td>
                    <span className={styles.category}>
                      Categoria 1
                    </span>
                  </td>
                  <td>20/07/2022</td>
                  <td className={styles.icon}><BiEdit /></td>
                  <td className={styles.icon}><AiOutlineClose /></td>
                </tr>
                <tr>
                  <td style={{textAlign: "left"}}>Transação 1</td>
                  <td style={formatColorNegativeNumber(-500)}>
                    {formatMoney(-500)}
                  </td>
                  <td>
                    <span className={styles.category}>
                      Categoria 1
                    </span>
                  </td>
                  <td>20/07/2022</td>
                  <td className={styles.icon}><BiEdit /></td>
                  <td className={styles.icon}><AiOutlineClose /></td>
                </tr>
                <tr>
                  <td style={{textAlign: "left"}}>Transação 1</td>
                  <td style={formatColorNegativeNumber(-500)}>
                    {formatMoney(-500)}
                  </td>
                  <td>
                    <span className={styles.category}>
                      Categoria 1
                    </span>
                  </td>
                  <td>20/07/2022</td>
                  <td className={styles.icon}><BiEdit /></td>
                  <td className={styles.icon}><AiOutlineClose /></td>
                </tr>
                <tr>
                  <td style={{textAlign: "left"}}>Transação 1</td>
                  <td style={formatColorNegativeNumber(-500)}>
                    {formatMoney(-500)}
                  </td>
                  <td>
                    <span className={styles.category}>
                      Categoria 1
                    </span>
                  </td>
                  <td>20/07/2022</td>
                  <td className={styles.icon}><BiEdit /></td>
                  <td className={styles.icon}><AiOutlineClose /></td>
                </tr>
                <tr>
                  <td style={{textAlign: "left"}}>Transação 1</td>
                  <td style={formatColorNegativeNumber(-500)}>
                    {formatMoney(-500)}
                  </td>
                  <td>
                    <span className={styles.category}>
                      Categoria 1
                    </span>
                  </td>
                  <td>20/07/2022</td>
                  <td className={styles.icon}><BiEdit /></td>
                  <td className={styles.icon}><AiOutlineClose /></td>
                </tr>
                <tr>
                  <td style={{textAlign: "left"}}>Transação 1</td>
                  <td style={formatColorNegativeNumber(-500)}>
                    {formatMoney(-500)}
                  </td>
                  <td>
                    <span className={styles.category}>
                      Categoria 1
                    </span>
                  </td>
                  <td>20/07/2022</td>
                  <td className={styles.icon}><BiEdit /></td>
                  <td className={styles.icon}><AiOutlineClose /></td>
                </tr>
                <tr>
                  <td style={{textAlign: "left"}}>Transação 1</td>
                  <td style={formatColorNegativeNumber(-500)}>
                    {formatMoney(-500)}
                  </td>
                  <td>
                    <span className={styles.category}>
                      Categoria 1
                    </span>
                  </td>
                  <td>20/07/2022</td>
                  <td className={styles.icon}><BiEdit /></td>
                  <td className={styles.icon}><AiOutlineClose /></td>
                </tr>
                <tr>
                  <td style={{textAlign: "left"}}>Transação 1</td>
                  <td style={formatColorNegativeNumber(-500)}>
                    {formatMoney(-500)}
                  </td>
                  <td>
                    <span className={styles.category}>
                      Categoria 1
                    </span>
                  </td>
                  <td>20/07/2022</td>
                  <td className={styles.icon}><BiEdit /></td>
                  <td className={styles.icon}><AiOutlineClose /></td>
                </tr>
                <tr>
                  <td style={{textAlign: "left"}}>Transação 1</td>
                  <td style={formatColorNegativeNumber(-500)}>
                    {formatMoney(-500)}
                  </td>
                  <td>
                    <span className={styles.category}>
                      Categoria 1
                    </span>
                  </td>
                  <td>20/07/2022</td>
                  <td className={styles.icon}><BiEdit /></td>
                  <td className={styles.icon}><AiOutlineClose /></td>
                </tr>
                <tr>
                  <td style={{textAlign: "left"}}>Transação 1</td>
                  <td style={formatColorNegativeNumber(-500)}>
                    {formatMoney(-500)}
                  </td>
                  <td>
                    <span className={styles.category}>
                      Categoria 1
                    </span>
                  </td>
                  <td>20/07/2022</td>
                  <td className={styles.icon}><BiEdit /></td>
                  <td className={styles.icon}><AiOutlineClose /></td>
                </tr>
                <tr>
                  <td style={{textAlign: "left"}}>Transação 1</td>
                  <td style={formatColorNegativeNumber(-500)}>
                    {formatMoney(-500)}
                  </td>
                  <td>
                    <span className={styles.category}>
                      Categoria 1
                    </span>
                  </td>
                  <td>20/07/2022</td>
                  <td className={styles.icon}><BiEdit /></td>
                  <td className={styles.icon}><AiOutlineClose /></td>
                </tr>
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
      
    </div>
  )
}
export default Home;