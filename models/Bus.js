import mongoose from "mongoose";

// Seat schema
const seatSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "booked"],
    default: "available",
  },
});

// Bus schema
const busSchema = new mongoose.Schema(
  {
    busId: {
      type: String,
      required: true,
      unique: true,
    },
    busName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["private", "luxury", "semi-luxury", "government"],
      required: true,
    },

  
    pricePerSeat: {
      type: Number,
      required: true,
      min: 0,
    },

    route: {
      from: { type: String, required: true },
      to: { type: String, required: true },
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      from: { type: String, required: true },
      to: { type: String, required: true },
    },
    seats: {
      type: [seatSchema],
      required: true,
    },
    busImage: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Bus = mongoose.model("Bus", busSchema);
export default Bus;
