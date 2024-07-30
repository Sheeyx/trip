import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { NotificationUpdate } from '../../libs/dto/notification/notification.update';
import { Message } from '../../libs/enums/common.enum';
import { CreateNotificationInput } from '../../libs/dto/notification/notification.input';
import { NotificationStatus } from '../../libs/enums/notification.enum';

@Injectable()
export class NotificationService {
  notificationService: any;
  constructor(@InjectModel('Notification') private readonly notificationModel: Model<Notification>) {}

  async createNotification(memberId: any, input: CreateNotificationInput): Promise<Notification> {
    try {
        const notification = await this.notificationModel.create({ ...input });
        return notification;
    } catch (err) {
        console.error('Failed to create notification:', err);
        throw new BadRequestException(Message.CREATE_FAILED);
    }
}

  async getNotifications(memberId: ObjectId): Promise<any[]> {
    try {
      const notifications = await this.notificationModel.aggregate([
        {
          $match: { receiverId: memberId },
        },
        {
          $lookup: {
            from: 'members', // The collection to join
            localField: 'receiverId', // Field from notifications collection
            foreignField: '_id', // Field from members collection
            as: 'memberData', // Alias for the joined data
          },
        },
        {
          $unwind: '$memberData', // Unwind the resulting array to denormalize the data
        },
      ]).exec();
  
      if (!notifications.length) {
        throw new NotFoundException(Message.NO_DATA_FOUND);
      }
  
      console.log(notifications);
      return notifications;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to get notifications');
    }
  }
  

  async updateNotification(notificationUpdate: NotificationUpdate): Promise<Notification> {
    const { _id, notificationStatus } = notificationUpdate;
    const notification = await this.notificationModel.findByIdAndUpdate(
        _id,
      { notificationStatus},
      { new: true },
    ).exec();

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }
}
