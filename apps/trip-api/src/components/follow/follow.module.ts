import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowResolver } from './follow.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import FollowSchema from '../../schemas/Follow.model';
import { MemberModule } from '../member/member.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: 'Follow', 
        schema: FollowSchema 
      }
    ]), 
    AuthModule,
    MemberModule,
    NotificationModule
  ],
  providers: [FollowService, FollowResolver],
  exports: [FollowService]
})
export class FollowModule {

}