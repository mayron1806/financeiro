import { useContext, useEffect, useState } from "react";
import {BiAddToQueue} from "react-icons/bi";
import CategoryTable from "../../../../components/categoryTable";
import Header from "../../../../components/header";
import AddCategory from "../../../../components/modals/addCategoty";
import ResultContext from "../../../../context/result";
import Icon from "../../../../enum/iconType";
import useCategory from "../../../../hooks/useCategory";
import CategoryType from "../../../../types/category";
import ResultType from "../../../../types/result";

import pageStyle from "../pages.module.css";

const Category = () => {  
  
  const { getCategories } = useCategory();

  const [addIsOpen, setAddIsOpen] = useState<boolean>(false);
  const openAddModal = () => setAddIsOpen(true);
  const closeAddModal = () => setAddIsOpen(false);

  const [categories, setCategories] = useState<CategoryType[]>([]);

  const searchCategories = () => {
    getCategories()
    .then(res => {
      setCategories(res);
    })
    .catch(error=>{
      const result: ResultType = {
        icon: Icon.SUCCESS,
        message: error.message
      };
      useContext(ResultContext).set(result);
    })
  }
  useEffect(()=> {
    searchCategories();
  }, [])

  return(
    <div>
      <Header title="Categoria"/>
      <div className={pageStyle.content}>
        <div className={pageStyle.head}>
          <h3>Categorias</h3>
          <button 
            className={pageStyle.button}
            onClick={()=> openAddModal()}
          >Criar <BiAddToQueue /></button>
        </div>
        <CategoryTable 
          categories={categories} 
          onChange={searchCategories} 
        />
      </div>
      {/* MODAL */}
      <AddCategory 
        isOpen={addIsOpen} 
        closeModal={closeAddModal} 
        onAdd={searchCategories}
      />
      {/* END MODAL */}
    </div>
  )
}
export default Category;