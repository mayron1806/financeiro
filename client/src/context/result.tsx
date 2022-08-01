import React, { createContext, Dispatch } from "react";
import ResultType from "../types/result";
type resultProps = {
  set: Dispatch<React.SetStateAction<ResultType>> 
}
const ResultContext = createContext<resultProps>({} as resultProps);
export default ResultContext;