import { Moment } from "moment";
import CategoryType from "./category";

type TransationType = {
  name: string,
  value: number,
  category: CategoryType,
  date: Moment,
  _id?: string
}
export default TransationType;