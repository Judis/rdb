import initStore from "./utils/init_store.js";
import reducersFactory from "./utils/reducer_factory";

import Guests from "./demo/guests";

if (process.env.NODE_ENV === "development") {
  window.pool = {};
}

let instance = null;

class DataBase {
  constructor(models = []) {
    if (instance) {
      return instance;
    } else {
      instance = this;
    }

    this.createReduxStorage();
    this.asyncReducers = {};

    models.forEach(this.registerModel.bind(this));
  }

  // Method to register model at DataBase module
  // modelClass: function / class
  registerModel(modelClass) {
    modelClass.storage = this;
    this[modelClass.name] = modelClass;
    reducersFactory(this, modelClass.name);
  }

  createReduxStorage() {
    this.reduxStorage = initStore();

    for (let method in this.reduxStorage) {
      this[method] = this.reduxStorage[method];
    }

    if (process.env.NODE_ENV === "development") {
      window.pool.storage = this.reduxStorage;
    }
  }
}

window.Guests = Guests;
window.DB = new DataBase([Guests]);
