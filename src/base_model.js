import uuidv4 from "uuid";
import filter from "./utils/filter";

class BaseModel {
  constructor(props = {}) {
    Object.keys(this.constructor.properties).forEach(key => {
      this[key] = props[key] || this.constructor.properties[key];
    });
  }

  save() {
    this.id = this.id || uuidv4();

    this.constructor.storage.dispatch({
      type: `UPDATE_${this.constructor.name.toUpperCase()}`,
      payload: this
    });

    return this;
  }

  update(props = {}) {
    Object.keys(props)
      .filter(key => this.hasOwnProperty(key))
      .forEach(key => {
        this[key] = props[key];
      });

    return this.save();
  }

  static get rawState() {
    return this.storage.getState()[this.name.toLowerCase()];
  }

  static get all() {
    return Object.values(this.rawState).map(raw => new this(raw));
  }

  static where(conditions) {
    const compiledFilter = filter(conditions);

    return this.all.filter(compiledFilter);
  }

  static getBy(field, value) {
    return new this(this.all.filter(el => el[field] === value)[0] || null);
  }

  static getByID(value) {
    return this.rawState[value];
  }

  static create(args = {}) {
    return new this(args).save();
  }

  static load(models = []) {
    this.storage.dispatch({
      type: `BATCH_${this.name.toUpperCase()}`,
      payload: models.reduce((acc, el) => {
        acc[el.id] = el;
        return acc;
      }, {})
    });

    return this.all;
  }

  static get properties() {
    return {
      id: {
        type: "number"
      }
    };
  }

  static get storage() {
    return this.__storage;
  }

  static set storage(value) {
    this.__storage = value;
  }
}

export default BaseModel;
