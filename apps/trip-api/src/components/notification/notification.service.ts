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
        const notification = await this.notificationModel.create({ ...input, memberId });
        
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
          localField: 'authorId', // Field from notifications collection
          foreignField: '_id', // Field from members collection
          as: 'memberData', // Alias for the joined data
        },
      },
      {
        $unwind: {
          path: '$memberData', // Unwind the resulting array to denormalize the data
          preserveNullAndEmptyArrays: true, // Preserve notifications without memberData
        },
      },
    ]).exec();

    // If no notifications are found, return an empty array instead of throwing an error
    if (!notifications.length) {
      return []; // Return an empty array when no notifications are found
    }

    console.log(notifications, "notifications");
    return notifications;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to get notifications');
  }
}


  async getWaitNotificationCount(memberId: ObjectId): Promise<number> {
  try {
    const waitCountResult = await this.notificationModel.aggregate([
      {
        $match: { 
          receiverId: memberId,
          notificationStatus: 'WAIT'
        },
      },
      {
        $count: 'waitCount',
      },
    ]).exec();

    const waitCount = waitCountResult[0]?.waitCount || 0;
    return waitCount;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to get wait notification count');
  }
}

  

  async updateNotification(input: NotificationUpdate): Promise<Notification> {
    const { _id, notificationStatus } = input;

    // Ensure _id is in the correct format
    const result = await this.notificationModel.findByIdAndUpdate(
      _id,
      { notificationStatus },
      { new: true }
    ).exec();

    return result;
  }
  
}
