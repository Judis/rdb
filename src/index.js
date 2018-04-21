import initStore from "./utils/init_store.js";
import reducersFactory from "./utils/reducer_factory";

import Guests from "./models/guests";
import BookingRooms from "./models/booking_rooms";

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
  registerModel(modelClass) {
    modelClass.storage = this;
    this[modelClass.name] = modelClass;
    reducersFactory(this, modelClass.name);
  }

  // Method to create redux storage
  createReduxStorage() {
    this.reduxStorage = initStore();

    for (let method in this.reduxStorage) {
      this[method] = this.reduxStorage[method];
    }
  }
}

window.DB = new DataBase([Guests, BookingRooms]);
