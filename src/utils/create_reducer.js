import { combineReducers } from "redux";
import ____ from "../reducers/init";

export default function createReducer(asyncReducers) {
  return combineReducers({
    ____,
    ...asyncReducers
  });
}
