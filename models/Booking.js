import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },
    busId: {
      
      type: String,
      required: true,
    },
    seats: [
      {
        type: Number,
        required: true,
      }
    ],
    passengerName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    totalPrice: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
