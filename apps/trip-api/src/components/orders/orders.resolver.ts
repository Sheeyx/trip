import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Order } from '../../libs/dto/orders/orders';
import { CreateOrderInput, UpdateOrderStatusInput } from '../../libs/dto/orders/orders.input';
import { OrderService } from './orders.service';
import { AnyARecord } from 'dns';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => [Order])
  async orders(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Query(() => [Order])
  async order(@Args('id', { type: () => String }) id: string): Promise<any> {
    console.log(id);
    
    return this.orderService.findOne(id);
  }

  @Mutation(() => Order)
  async createOrder(@Args('createOrderInput') createOrderInput: CreateOrderInput): Promise<Order> {
    return this.orderService.create(createOrderInput);
  }

  @Mutation(() => Order)
  async updateOrderStatus(@Args('updateOrderStatusInput') updateOrderStatusInput: UpdateOrderStatusInput): Promise<Order> {
    return this.orderService.updateStatus(updateOrderStatusInput);
  }
}
