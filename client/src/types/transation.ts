type TransationType = {
  name: string,
  value: number,
  category: {
    name: string,
    isEntry: boolean
  }
  date: Date
}
export default TransationType;