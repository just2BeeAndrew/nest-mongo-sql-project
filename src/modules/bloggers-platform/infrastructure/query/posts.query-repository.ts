import { Injectable } from '@nestjs/common';
import { PostsViewDto } from '../../api/view-dto/posts.view-dto';
import { LikeStatus } from '../../../../core/dto/like-status';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findPostById(
    id: string,
    status: LikeStatus,
  ): Promise<PostsViewDto | null> {
    const post = await this.dataSource.query(
      `
    SELECT * FROM "Posts" p JOIN "ExtendedLikesInfo" e ON p.id = e.id WHERE p.id = $1 AND "deletedAt" IS NULL 
    `,
      [id],
    );

    if (post.length === 0) return null;

    return PostsViewDto.mapToView(post, status);
  }
}
