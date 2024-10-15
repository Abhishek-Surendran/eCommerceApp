import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        qty: { type: Number, required: true },
      }
    ],
    shippingAddress: {
      address: { type: String, required: true },
    },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['confirmed', 'in transit', 'delivered', 'declined'],
      default: 'confirmed'
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
