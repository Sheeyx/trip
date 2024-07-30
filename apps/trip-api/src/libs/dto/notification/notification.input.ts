import { InputType, Field, ID } from '@nestjs/graphql';
import { NotificationType, NotificationStatus, NotificationGroup } from '../../enums/notification.enum';
import { ObjectId } from 'mongoose';

@InputType()
export class CreateNotificationInput {
  @Field(() => NotificationType)
  notificationType: NotificationType;

  @Field(() => NotificationStatus, { defaultValue: NotificationStatus.WAIT })
  notificationStatus: NotificationStatus;

  @Field(() => NotificationGroup)
  notificationGroup: NotificationGroup;

  @Field()
  notificationTitle: string;

  @Field({ nullable: true })
  notificationDesc?: string;

  @Field(() => String)
  authorId: ObjectId;

  @Field(() => String)
  receiverId: ObjectId;

  @Field(() => String, { nullable: true })
  propertyId?: ObjectId;

  @Field(() => String, { nullable: true })
  articleId?: ObjectId;
}
