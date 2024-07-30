import { InputType, Field, ID } from '@nestjs/graphql';
import { NotificationStatus } from '../../enums/notification.enum';
import { ObjectId } from 'mongoose';

@InputType()
export class NotificationUpdate {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => NotificationStatus)
    notificationStatus: NotificationStatus;

}
