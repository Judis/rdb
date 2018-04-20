import { createStore } from "redux";
import rootReducer from "../reducers/root";

export default function initStore() {
  return createStore(
    rootReducer,
    process.env.NODE_ENV === "development" &&
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()
  );
}
