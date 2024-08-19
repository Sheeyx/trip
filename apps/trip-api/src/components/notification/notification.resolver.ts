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
@Query(() => Number)
public async getWaitNotificationCount(
  @Args('notificationId') notificationId: string,
  @AuthMember('_id') memberId: ObjectId,
): Promise<number> {
  console.log('Query: getWaitNotificationCount');

  const shapedNotificationId = shapeIntoMongoObjectId(notificationId);

  return await this.notificationService.getWaitNotificationCount(shapedNotificationId);
}

  @Mutation(() => NotificationDto)
  async updateNotification(
    @Args('input') input: NotificationUpdate
  ): Promise<Notification> {
    return this.notificationService.updateNotification(input);
  }

  
}
