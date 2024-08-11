import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsInt, Min } from 'class-validator';
import { ObjectId } from 'mongoose';

@InputType()  // Mark Guests as an InputType
class GuestsInput {
  @IsInt()
  @Min(1)
  @Field(() => Int)
  adults: number;

  @IsInt()
  @Min(0)
  @Field(() => Int)
  children: number;

  @IsInt()
  @Min(1)
  @Field(() => Int)
  rooms: number;
}

@InputType()
export class CreateOrderInput {
  @IsNotEmpty()
  @Field(() => String)
  propertyId: ObjectId;

  @IsNotEmpty()
  @Field(() => String)
  memberId: ObjectId;

  @IsNotEmpty()
  @Field(() => Number)
  price: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Field(() => Int)
  days: number;

  @IsNotEmpty()
  @Field(() => Date)
  checkIn: Date;

  @IsNotEmpty()
  @Field(() => Date)
  checkOut: Date;

  @IsNotEmpty()
  @Field(() => GuestsInput)
  guests: GuestsInput;  // Ensure this is non-nullable
}

@InputType()
export class UpdateOrderStatusInput {
  @IsNotEmpty()
  @Field(() => String)
  orderId: ObjectId;

  @IsNotEmpty()
  @Field(() => String)
  orderStatus: string;
}
