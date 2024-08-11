import { Schema } from 'mongoose';

const OrderSchema = new Schema(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Property',
    },
    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Member',
    },
    price: {
      type: Number,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    subtotalPrice: {
      type: Number,
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    guests: {
      adults: {
        type: Number,
        required: true,
      },
      children: {
        type: Number,
        required: true,
      },
      rooms: {
        type: Number,
        required: true,
      },
    },
    orderDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
      default: 'PENDING',
    },
  },
  { timestamps: true, collection: 'orders' }
);

OrderSchema.index({ propertyId: 1, memberId: 1, checkIn: 1, checkOut: 1 }, { unique: true });

export default OrderSchema;
