export const formatMoney = (value: number) => {
  return value.toLocaleString("pt-br", {style: "currency", currency: "BRL"});
}
export const formatColorNegativeNumber = (value: number) => {
   return value < 0 ? {color: "var(--red)"} : {color: "var(--green)"}
}