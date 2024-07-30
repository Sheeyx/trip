import { Field, ObjectType, ID } from '@nestjs/graphql';
import { NotificationType, NotificationStatus, NotificationGroup } from '../../enums/notification.enum';
import { ObjectId } from 'mongoose';
import { Member } from '../member/member';

@ObjectType()
export class NotificationDto {
    @Field(() => String)
    _id: ObjectId;

    @Field(() => NotificationType)
    notificationType: NotificationType;

    @Field(() => NotificationStatus)
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

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field(() => Member, {nullable: true})
	memberData?: Member;
}
