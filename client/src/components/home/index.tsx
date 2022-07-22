import Card from "../card";
import Header from "../header";
import { GiMoneyStack } from "react-icons/gi";
import { BiCalendar } from "react-icons/bi";
import { MdMoneyOffCsred } from "react-icons/md";
import styles from "./home.module.css";
import Select, { CSSObjectWithLabel } from "react-select";
import { useEffect, useState } from "react";
import TransationCount from "../transationCount";
import TransationTable from "../transationTable";
import useTransation from "../../hooks/useTransation";
import TransationType from "../../types/transation";
import useAuth from "../../hooks/useAuth";
import moment from "moment";

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

const getTransationsSum = (transations: TransationType[]) => {
  let sum = 0;
  transations.forEach(transation => {
    sum += transation.value;
  });
  return sum;
}

const Home = () => {
  const { authContext } = useAuth();
  const { getAllTransations, getFilteredTransations } = useTransation(authContext.user?.id); 

  // todas transações
  const [allTransations, setAllTransations] = useState<TransationType[]>([]);
  useEffect(()=>{
    getAllTransations()
    .then(res => {
      setAllTransations(res);
    })
    .catch(err=>{
      console.log(err);
    })
  }, []);
  
  // transações filtradas
  const [filteredTransations, setFilteredTransations] = useState<TransationType[]>([]);
  const [transationFilter, setTransationFilter] = useState<number | undefined>(7);
  useEffect(()=>{
    getFilteredTransations({min_date: moment().subtract(transationFilter, "days").toDate()})
    .then(res => {
      setFilteredTransations(res);
    })
    .catch(err=>{
      console.log(err);
    })
  }, [filteredTransations]);

  const entry_sum = getTransationsSum(allTransations.filter(t=> t.category.isEntry));
  const exit_sum = getTransationsSum(allTransations.filter(t=> !t.category.isEntry));
  const total = entry_sum + exit_sum;

  return(
    <div className={styles.container}>
      <Header title="Inicio"/>
      <div className={styles.content}>
        {/* CARDS */}
        <div className={styles.cards}>
          <Card money={entry_sum} title={"Entradas"}>
            <GiMoneyStack />
          </Card>
          <Card money={exit_sum} title={"Saidas"}>
            <MdMoneyOffCsred />
          </Card>
          <Card money={total} title={"Total"}>
            <BiCalendar />
          </Card>
        </div>
        {/* END CARDS */}
        {/* TRANSATIONS TABLE */}
        <div>
          <div className={styles.head}>
            <h3>Transações</h3>
            <Select 
              defaultValue={options[0]} 
              options={options}
              onChange={(value) => setTransationFilter(value?.value)}
              styles={selectStyle}
            />
          </div>
          <div className={styles.table_container} >
           <TransationTable transatios={filteredTransations} />
          </div>
        </div>
        {/* END TRANSATIONS TABLE */}
        {/* TRANSATIONS COUNT */}
        <TransationCount transations={filteredTransations}/>
        {/* END TRANSATIONS COUNT */}
      </div>
    </div>
  )
}
export default Home;