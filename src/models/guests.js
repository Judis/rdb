import BaseModel from "../base_model";

class Guests extends BaseModel {
  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  static get properties() {
    return {
      id: null,
      firstName: null,
      lastName: null,
      email: null
    };
  }
}

export default Guests;
