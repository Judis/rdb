import uuidv4 from "uuid";

class BaseModel {
  constructor(args = {}) {
    Object.keys(this.constructor.properies).forEach(key => {
      this[key] = args[key] || this.constructor.properies[key];
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

  update(args = {}) {
    Object.keys(args)
      .filter(key => this.hasOwnProperty(key))
      .forEach(key => {
        this[key] = args[key];
      });

    return this.save();
  }

  static get rawState() {
    return this.storage.getState()[this.name.toLowerCase()];
  }

  static get all() {
    return Object.values(this.rawState).map(raw => new this(raw));
  }

  // static where(conditions) {
  //   ...
  //   Use solution from MapBox GL Filters
  //   https://github.com/mapbox/mapbox-gl-js/tree/64e98417bf290bf9f3c893e20f1015f2d7769de0/src/style-spec/feature_filter
  // }

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

  static get properies() {
    return {
      id: null
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
