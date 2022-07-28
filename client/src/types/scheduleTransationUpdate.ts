import { Moment } from "moment";
import CategoryType from "./category";

type ScheduleTransationUpdateType = {
  name?: string,
  value?: number,
  next_date?: Moment,
  max?: number,
  category?: CategoryType,
  _id: string
}
export default ScheduleTransationUpdateType;