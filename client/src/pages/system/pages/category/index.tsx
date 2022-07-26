import { useEffect, useState } from "react";
import {BiAddToQueue} from "react-icons/bi";
import CategoryTable from "../../../../components/categoryTable";
import Header from "../../../../components/header";
import AddCategory from "../../../../components/modals/addCategoty";
import useAuth from "../../../../hooks/useAuth";
import useCategory from "../../../../hooks/useCategory";
import CategoryType from "../../../../types/category";

import pageStyle from "../pages.module.css";
import styles from "./category.module.css";

const Category = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const openModal = ()=> setIsOpen(true);
  const closeModal = ()=> setIsOpen(false);

  const [categories, setCategories] = useState<CategoryType[]>([]);

  const { getCategories } = useCategory();
  
  useEffect(()=> {
    getCategories()
    .then(res => {
      setCategories(res);
    })
    .catch(error=>{
      console.log(error);
    })
  }, [])
  return(
    <div>
      <Header title="Categoria"/>
      <div className={pageStyle.content}>
        <div className={pageStyle.head}>
          <h3>Categorias</h3>
          <button 
            className={pageStyle.button}
            onClick={()=> openModal()}
          >Criar <BiAddToQueue /></button>
        </div>
        <CategoryTable categories={categories}/>
      </div>
      {/* MODAL */}
      <AddCategory isOpen={isOpen} closeModal={closeModal} setCategories={setCategories}/>
      {/* END MODAL */}
    </div>
  )
}
export default Category;