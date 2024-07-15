import { Module } from '@nestjs/common';
import { BoardArticleResolver } from './board-article.resolver';
import { BoardArticleService } from './board-article.service';
import { MongooseModule } from '@nestjs/mongoose';
import PropertySchema from '../../schemas/Property.model';
import { MemberModule } from '../member/member.module';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: "BoardArticle",
        schema: PropertySchema,
      },
    ]),
    AuthModule,
    MemberModule,
    ViewModule
  ],
  providers: [BoardArticleResolver, BoardArticleService],
  exports: [BoardArticleService ]
})
export class BoardArticleModule {}