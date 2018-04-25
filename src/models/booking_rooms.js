import BaseModel from "../base_model";

class BookingRooms extends BaseModel {
  static get properties() {
    return {
      id: null,
      bookingId: null,
      checkinDate: null,
      checkoutDate: null,
      nights: null,
      roomId: null,
      guestName: null,
      status: null,
      paidStatus: null,
      occupationStatus: null,
      customerType: null,
      updatedAt: null
    };
  }
}

export default BookingRooms;
