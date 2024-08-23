import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { PropertyModule } from './property/property.module';
import { AuthModule } from './auth/auth.module';
import { BoardArticleModule } from './board-article/board-article.module';
import { CommentModule } from './comment/comment.module';
import { FollowModule } from './follow/follow.module';
import { LikeModule } from './like/like.module';
import { ViewModule } from './view/view.module';
import { NotificationService } from './notification/notification.service';
import { NotificationModule } from './notification/notification.module';
import { OrderModule } from './orders/orders.module';
import { NoticeModule } from './notice/notice.module';

@Module({
  imports: [MemberModule, PropertyModule, AuthModule, BoardArticleModule, CommentModule, FollowModule, LikeModule, ViewModule, NotificationModule, OrderModule, NoticeModule],
})
export class ComponentsModule {}
