import { combineReducers } from "redux";
import csvReducer from "./csvData/csvReducer";
import mapReducer from "./Map/MapReducer";
export default combineReducers({ data: csvReducer, map: mapReducer });
