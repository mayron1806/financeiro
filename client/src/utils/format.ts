export const formatMoney = (value: number) => {
  let formated =  value.toLocaleString("pt-br", {style: "currency", currency: "BRL"});
  return formated;
}
export const formatColorNumbers = (value: number) => {
  return value >= 0  ? {color: "var(--green)"} : {color: "var(--red)"};
}