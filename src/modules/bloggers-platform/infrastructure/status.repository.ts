import { Injectable } from '@nestjs/common';
import { Category } from '../../../core/dto/category';
import { LikeStatus } from '../../../core/dto/like-status';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateStatusDto } from '../dto/create-status.dto';
import { LikeDetails } from '../dto/like-details';

@Injectable()
export class StatusRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async find(userId: string, categoryId: string, category: Category) {
    const status =  await this.dataSource.query(
      `
        SELECT *
        FROM "Statuses"
        WHERE "userId" = $1
          AND "categoryId" = $2
          AND category = $3;
      `,
      [userId, categoryId, category],
    );

    return status[0] || null
  }

  async create(body: CreateStatusDto) {
    console.log(body);
    await this.dataSource.query(
      `
      INSERT INTO "Statuses" (id, "userId", login, "categoryId", category, status, "addedAt")
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())
    `,
      [body.userId, body.login, body.categoryId, body.category, body.status],
    );
  }

  async updateStatus(id: string, newStatus: LikeStatus) {
    await this.dataSource.query(
      `
    UPDATE "Statuses" SET status = $1 WHERE id = $2
    `,
      [newStatus, id],
    );
  }

  async findNewestLikes(postId: string) {
    const newestLikes = await this.dataSource.query(
      `
      SELECT "userId"
      FROM "Statuses"
      WHERE "categoryId" = $1
        AND category = 'Post'
        AND status = 'Like'
      ORDER BY "addedAt" DESC 
      LIMIT 3;
    `,
      [postId],
    );

    return newestLikes.map((like) => {
      return new LikeDetails(like.createdAt, like.userId, like.login);
    });
  }
}
