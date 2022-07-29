import Header from "../../../../components/header";
import pageStyle from "../pages.module.css";

const Help = () => {
  return(
    <div>
      <Header title="Ajuda"/>
      <div className={pageStyle.content}>
        <ul>
          <li>Categoria</li>
        </ul>
      </div>
    </div>
  )
}
export default Help;