import { CSSObjectWithLabel } from "react-select";

export const selectStyle = {
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