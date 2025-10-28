import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import { Post } from '../domain/entities/post.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async savePost(post: Post): Promise<Post> {
    return this.postsRepository.save(post);
  }

  async findById(id: string) {
    return await this.postsRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: {
        extendedLikesInfo: true,
      },
    });
  }

  async updateCounters(likesCount: number, dislikesCount: number, id: string) {
    // await this.dataSource.query(
    //   `
    //     UPDATE "ExtendedLikesInfo" e
    //     SET "likesCount"   = $1,
    //         "dislikesCount" = $2
    //     FROM "Posts" p
    //     WHERE p.id = e.id
    //       AND p.id = $3
    //       AND p."deletedAt" IS NULL
    //   `,
    //   [likesCount, dislikesCount, id],
    // );
  }

  async softDelete(id: string) {
    //   return await this.dataSource.query(
    //     `
    //       UPDATE "Posts"
    //       SET "deletedAt" = NOW()
    //       WHERE id = $1
    //         AND "deletedAt" IS NULL
    //       RETURNING id;
    //     `,
    //     [id],
    //   );
  }
}
