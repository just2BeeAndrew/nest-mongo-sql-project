import { Injectable } from '@nestjs/common';
import { Category } from '../../../core/dto/category';
import { LikeStatus } from '../../../core/dto/like-status';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class StatusRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async find(
    userId: string,
    categoryId: string,
    category: Category,
  ) {
    return await this.dataSource.query(`
    SELECT * FROM "Statuses" WHERE "userId" = $1 AND "categoryId" = $2 AND category = $3;
    `, [userId, categoryId, category]);
    // ({
    //   userId: userId,
    //   categoryId: categoryId,
    //   category: category,
    // });
  }

  async getNewestLikes(postId: string) {
    const newestLikes = await this.StatusModel.find({
      categoryId: postId,
      category: Category.Post,
      status: LikeStatus.Like,
    })
      .sort({ createdAt: -1 })
      .limit(3);

    return newestLikes.map(like =>{
      return new LikeDetails(
        like.createdAt,
        like.userId,
        like.login,
      )
    });
  }
}
