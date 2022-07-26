import { Moment } from "moment";
import CategoryType from "./category";

type ScheduleTransationType = {
  name: string,
  value: number,
  execution: {
    next_date: Moment,
    max?: number,
    count?: number 
  }
  category: CategoryType,
  _id?: string
}
export default ScheduleTransationType;