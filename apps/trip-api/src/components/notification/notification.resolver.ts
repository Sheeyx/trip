import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDto } from '../../libs/dto/notification/notification';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongodb';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { NotificationUpdate } from '../../libs/dto/notification/notification.update';

@Resolver()
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(AuthGuard)
  @Query(() => [NotificationDto])
  public async getNotification(
    @Args('notificationId') notificationId: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<NotificationDto[]> {
    console.log('Query: getNotification');

    const shapedNotificationId = shapeIntoMongoObjectId(notificationId);

    return await this.notificationService.getNotifications(shapedNotificationId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => NotificationDto)
  public async updateNotification(
    @Args('notificationUpdate') notificationUpdate: NotificationUpdate,
  ): Promise<any> {
    console.log('Mutation: updateNotification');

    return await this.notificationService.updateNotification(notificationUpdate);
  }
  
}
