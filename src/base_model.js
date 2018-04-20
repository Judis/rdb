import uuidv4 from 'uuid';

const values = Symbol('values');

const __defineSetterAndGetter = function(target, key) {
  Object.defineProperty(
    target,
    key,
    {
      get() {
        return target[values][key];
      },
      set(value) {
        target[values][key] = value;
      }
    }
  );
};

const __dispatchChanges = function(target) {
  target.constructor.storage.dispatch({type: `UPDATE_${target.constructor.name.toUpperCase()}`, payload: target[values]});
}

const __fillProperties = function(target, args) {
  target[values] = {};

  Object.keys(target.constructor.properies).forEach(key => {
    target[values][key] = args[key] || target.constructor.properies[key];
    __defineSetterAndGetter(target, key);
  });

  __defineUUID(target, args);
}

const __defineUUID = function(target, args) {
  target[values].uuid = args.uuid || null;
  Object.defineProperty(
    target,
    'uuid',
    {
      get() {
        return target[values].uuid;
      },
    }
  );
}


class BaseModel {
  constructor(args = {}) {
    __fillProperties(this, args);
  }

  save() {
    return this.uuid ? this.update() : this.constructor.create(this[values]);
  }

  update(args = {}) {
    Object.keys(args)
      .filter(key => this.hasOwnProperty(key))
      .forEach(key => {
        this[values][key] = args[key];
      });

    __dispatchChanges(this);
  }

  static get rawState() {
    return this.storage.getState()[this.name.toLowerCase()];
  }

  static get all() {
    return Object.values(this.rawState)
      .map(raw => new this(raw));
  }

  static where(conditions) {
    // ...
    // Use solution from MapBox GL Filters
    // https://github.com/mapbox/mapbox-gl-js/tree/64e98417bf290bf9f3c893e20f1015f2d7769de0/src/style-spec/feature_filter
  }

  static getBy(field, value) {
    return new this(this.all.filter(el => el[field] === value)[0] || null);
  }

  static getByUUID(value) {
    return this.rawState[value];
  }

  static create(args = {}) {
    let payload = {
      uuid: uuidv4()
    };

    Object.keys(this.properies).forEach(key => {
      payload[key] = args[key] || this.properies[key];
    });

    this.storage.dispatch({type: `ADD_${this.name.toUpperCase()}`, payload: payload});

    return new this(
      this.storage.getState()[this.name.toLocaleLowerCase()][payload.uuid]
    );
  }

  static get properies() {
    return {
      id: null
    }
  }

  static get storage() {
    return this.__storage;
  }

  static set storage(value) {
    this.__storage = value;
  }
}

export default BaseModel;
