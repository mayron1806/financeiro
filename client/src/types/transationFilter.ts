import { Moment } from "moment";
import CategoryType from "./category";

type TransationFilterType = {
  min_date?: Moment,
  max_date?: Moment,
  categories?: string[],
  is_entry?: boolean,
  name?: string,
  value?: number
}
export default TransationFilterType;