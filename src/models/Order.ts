import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        id: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "en attente",
    },
    billingAddress: {
      street: String,
      city: String,
      postalCode: String,
      country: String,
    },
    shippingAddress: {
      street: String,
      city: String,
      postalCode: String,
      country: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
