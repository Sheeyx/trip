import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { PropertyService } from '../property/property.service';
import { BoardArticleService } from '../board-article/board-article.service';
import { CommentInput, CommentsInquiry } from '../../libs/dto/comment/comment.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { CommentUpdate } from '../../libs/dto/comment/comment.update';
import { lookupMember } from '../../libs/config';
import { Comments } from '../../libs/dto/comment/comment';
import { T } from '../../libs/types/common';
import { NotificationService } from '../notification/notification.service';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../libs/enums/notification.enum';
import { CreateNotificationInput } from '../../libs/dto/notification/notification.input';

@Injectable()
export class CommentService {
    constructor(
		@InjectModel('Comment') private readonly commentModel: Model<Comment>,
		private readonly memberService: MemberService,
		private readonly propertyService: PropertyService,
		private readonly boardArticleService: BoardArticleService,
		private readonly notificationService: NotificationService,
	) {}

    public async createComment(memberId: ObjectId, input: CommentInput): Promise<Comment> {
        input.memberId = memberId;
        let result = null;
        try {
          result = await this.commentModel.create(input);
        } catch (err) {
          console.log('Error, Service. model:', err.message);
          throw new BadRequestException(Message.CREATE_FAILED);
        }
      
        switch (input.commentGroup) {
          case CommentGroup.PROPERTY:
              await this.propertyService.propertyStatsEditor({
                  _id: input.commentRefId,
                  targetKey: 'propertyComments',
                  modifier: 1,
              });
      
              const propertyNotificationInput: CreateNotificationInput = {
                  notificationType: NotificationType.COMMENT,
                  notificationStatus: NotificationStatus.WAIT,
                  notificationGroup: NotificationGroup.PROPERTY,
                  notificationTitle: 'Property Comment Added',
                  notificationDesc: 'A new comment has been added to the property.',
                  authorId: input.memberId, // The ID of the member who made the comment
                  receiverId: input.commentRefId, // The ID of the property owner or relevant user
              };
      
              await this.notificationService.createNotification(input.memberId, propertyNotificationInput);
              break;
      
          case CommentGroup.ARTICLE:
              await this.boardArticleService.boardArticleStatsEditor({
                  _id: input.commentRefId,
                  targetKey: 'articleComments',
                  modifier: 1,
              });
      
              const articleNotificationInput: CreateNotificationInput = {
                  notificationType: NotificationType.COMMENT,
                  notificationStatus: NotificationStatus.WAIT,
                  notificationGroup: NotificationGroup.ARTICLE,
                  notificationTitle: 'Article Comment Added',
                  notificationDesc: 'A new comment has been added to the article.',
                  authorId: input.memberId, // The ID of the member who made the comment
                  receiverId: input.commentRefId, // The ID of the article author or relevant user
              };
      
              await this.notificationService.createNotification(input.memberId, articleNotificationInput);
              break;
      
          case CommentGroup.MEMBER:
              await this.memberService.memberStatsEditor({
                  _id: input.commentRefId,
                  targetKey: 'memberComments',
                  modifier: 1,
              });
      
              const memberNotificationInput: CreateNotificationInput = {
                  notificationType: NotificationType.COMMENT,
                  notificationStatus: NotificationStatus.WAIT,
                  notificationGroup: NotificationGroup.MEMBER,
                  notificationTitle: 'Member Comment Added',
                  notificationDesc: 'A new comment has been added to your profile.',
                  authorId: input.memberId,
                  receiverId: input.commentRefId,
              };
      
              await this.notificationService.createNotification(input.memberId, memberNotificationInput);
              break;
      
          default:
              throw new Error('Unsupported comment group');
      }
      
      
        if (!result) throw new InternalServerErrorException(Message.CREATE_FAILED);
        return result;
      }


    public async updateComment(memberId: ObjectId, input: CommentUpdate): Promise<Comment> {
		const { _id } = input;
    const result = await this.commentModel
			.findOneAndUpdate(
				{
					_id: _id,
					memberId: memberId,
					commentStatus: CommentStatus.ACTIVE,
				},
				input,
				{ new: true },
			)
			.exec();

		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		return result;
	}

    public async getComments(memberId: ObjectId, input: CommentsInquiry): Promise<Comments> {
        const { commentRefId } = input.search;
        const match: T = { commentRefId: commentRefId, commentStatus: CommentStatus.ACTIVE };
        const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };
      
        const result: Comments[] = await this.commentModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							// meLiked
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
      
      
        if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
        return result[0];
      }
      
      public async removeCommentByAdmin(input: ObjectId): Promise<Comment> {
      const result = await this.commentModel.findByIdAndDelete(input).exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
		return result;
	}
      
      
}