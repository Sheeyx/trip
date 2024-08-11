import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { Property } from '../property/property';

@ObjectType()
class Guests {
  @Field(() => Int)
  adults: number;

  @Field(() => Int)
  children: number;

  @Field(() => Int)
  rooms: number;
}

@ObjectType()
export class Order {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => Property, { nullable: true })
  property: Property;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => Date)
  orderDate: Date;

  @Field(() => String)
  orderStatus: string;

  @Field(() => Number)
  price: number;

  @Field(() => Int)
  days: number;

  @Field(() => Number)
  subtotalPrice: number;

  @Field(() => Date)
  checkIn: Date;

  @Field(() => Date)
  checkOut: Date;

  @Field(() => Guests)
  guests: Guests;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}