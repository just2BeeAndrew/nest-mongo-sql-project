import { Injectable } from '@nestjs/common';
import { LikeStatus } from '../../../core/dto/like-status';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateStatusDto } from '../dto/create-status.dto';
import { LikeDetails } from '../dto/like-details';
import { PostStatus } from '../domain/entities/post-status.entity';

@Injectable()
export class PostStatusRepository {
  constructor(
    @InjectRepository(PostStatus) private postStatusRepository: Repository<PostStatus>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async find(userId: string, postId: string) {
    console.log(userId);
    return await this.postStatusRepository.findOne({
      where: { userId: userId, postId: postId },
    });
  }

  async create(body: CreateStatusDto) {
  //   console.log(body);
  //   await this.dataSource.query(
  //     `
  //     INSERT INTO "Statuses" (id, "userId", login, "categoryId", category, status, "addedAt")
  //     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())
  //   `,
  //     [body.userId, body.login, body.categoryId, body.category, body.status],
  //   );
  }

  async updateStatus(id: string, newStatus: LikeStatus) {
    // await this.dataSource.query(
    //   `
    // UPDATE "Statuses" SET status = $1 WHERE id = $2
    // `,
    //   [newStatus, id],
    // );
  }

  async findNewestLikes(postId: string) {
    // const newestLikes = await this.dataSource.query(
    //   `
    //   SELECT "userId"
    //   FROM "Statuses"
    //   WHERE "categoryId" = $1
    //     AND category = 'Post'
    //     AND status = 'Like'
    //   ORDER BY "addedAt" DESC
    //   LIMIT 3;
    // `,
    //   [postId],
    // );
    //
    // return newestLikes.map((like) => {
    //   return new LikeDetails(like.createdAt, like.userId, like.login);
    // });
  }
}
