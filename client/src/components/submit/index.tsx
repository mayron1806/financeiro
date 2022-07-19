import "./style.css";

type props = {
  value: string
}
const Submit = ({value} : props) => {
  return <input className="submit" type="submit" value={value}/>
  
}
export default Submit;