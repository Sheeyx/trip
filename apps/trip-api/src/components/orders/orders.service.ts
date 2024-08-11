import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderInput, UpdateOrderStatusInput } from '../../libs/dto/orders/orders.input';
import { Order } from '../../libs/dto/orders/orders';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Injectable()
export class OrderService {
  constructor(@InjectModel('Order') private orderModel: Model<Order>) {}

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().populate('property').exec();
  }

//   async findOne(id: string): Promise<any> {
//     const result = await this.orderModel.find({ memberId: id }).exec();
//     console.log(result);

//     return result;
//   }

async findOne(memberId: string): Promise<any> {
    const objectId = shapeIntoMongoObjectId(memberId); // Ensure memberId is cast to ObjectId

    const result = await this.orderModel.aggregate([
      { $match: { memberId: objectId } }, // Match orders by memberId
      {
        $lookup: {
          from: 'properties', // The collection name of the properties
          localField: 'propertyId', // The field in the orders collection
          foreignField: '_id', // The field in the properties collection
          as: 'property'
        }
      },
      {
        $unwind: {
          path: '$property',
          preserveNullAndEmptyArrays: true // In case there are orders without properties
        }
      }
    ]).exec();

    console.log(result);

    if (!result || result.length === 0) {
      throw new NotFoundException(`No orders found for member with ID ${memberId}`);
    }

    return result;
  }




  async create(createOrderInput: CreateOrderInput): Promise<Order> {
    const { propertyId, memberId, price, days, checkIn, checkOut, guests } = createOrderInput;
    const { adults, children, rooms } = guests;
    const subtotalPrice = price * days;
    const newOrder = new this.orderModel({
      propertyId,
      memberId,
      price,
      days,
      subtotalPrice,
      checkIn,
      checkOut,
      guests: {
        adults,
        children,
        rooms,
      },
      orderDate: new Date(),
      orderStatus: 'PENDING',
    });
    return newOrder.save();
  }

  async updateStatus(updateOrderStatusInput: UpdateOrderStatusInput): Promise<Order> {
    return this.orderModel
      .findByIdAndUpdate(
        updateOrderStatusInput.orderId,
        { orderStatus: updateOrderStatusInput.orderStatus },
        { new: true }
      )
      .populate('property')
      .exec();
  }
}
