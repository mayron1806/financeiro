import { Moment } from "moment";
import CategoryType from "./category";

type TransationUpdateType = {
  _id: string,
  name?:string, 
  category?:CategoryType, 
  value?: number, 
  date?: Moment
}
export default TransationUpdateType;