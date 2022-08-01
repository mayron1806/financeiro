import styles from "./table.module.css";
import { BiEdit } from "react-icons/bi";
import { BsSafe } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import CategoryType from "../../types/category";
import useCategory from "../../hooks/useCategory";
import { useContext, useState } from "react";
import UpdateCategory from "../modals/updateCategory";
import ResultType from "../../types/result";
import Icon from "../../enum/iconType";
import ResultContext from "../../context/result";

type props = {
  categories: CategoryType[],
  onChange: () => void
}
const CategoryTable = ({categories, onChange}: props) => {
  const resultContext = useContext(ResultContext);

  const { deleteCategory } = useCategory();
  const del = (category: CategoryType) => {
    if(!category._id) return;
    deleteCategory([category])
    .then(res => {
      onChange();
      const result: ResultType = {
        icon: Icon.SUCCESS,
        message: "Categoria(s) deletada(s) com sucesso."
      };
      resultContext.set(result);
    })
    .catch(error=>{
      const result: ResultType = {
        icon: Icon.ERROR,
        message: error.message
      };
      resultContext.set(result);
    })
  } 

  const [categoryToUpdate, setCategoryToUpdate] = useState<CategoryType>();

  const [updateIsOpen, setUpdateIsOpen] = useState<boolean>(false);
  const openUpdateModal = () => setUpdateIsOpen(true);
  const closeUpdateModal = () => setUpdateIsOpen(false);
  
  return(
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{textAlign: "left"}}>Nome</th>
            <th>Tipo</th>
            <th>Cor</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            categories.map(category =>{
              const {name, is_entry, color} = category;
              return(
                <tr key={name}>
                  <td style={{textAlign: "left"}}>{name}</td>
                  <td>{is_entry ? "Entrada" : "Saida"}</td>
                  <td className={styles.color} >
                    <div style={{backgroundColor: color}}></div>
                  </td>
                  <td className={styles.icon}>
                    <BiEdit onClick={() => {
                        setCategoryToUpdate(category);
                        openUpdateModal();
                      }}
                    />
                  </td>
                  <td className={styles.icon}>
                    <AiOutlineClose onClick={()=> del(category)} />
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
      {
        categories.length < 1 &&
        <div className={styles.no_category}>
          <BsSafe />
          <p>Não há transações neste periodo.</p>
        </div>
      }
      {
        categoryToUpdate && 
        <UpdateCategory 
          isOpen={updateIsOpen} 
          closeModal={closeUpdateModal} 
          onUpdate={onChange} 
          categoryToUpdate={categoryToUpdate}
        />
      }
    </div>
  )
}
export default CategoryTable;