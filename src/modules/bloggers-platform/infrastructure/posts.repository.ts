import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Post } from '../domain/entities/post.entity';

@Injectable()
export class PostsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource,
              @InjectRepository(PostsRepository) private postsRepository: Repository<Post>) {}

  async savePost(post:Post): Promise<Post> {
    return this.postsRepository.save(post)
  }

  async findById(id: string) {
    const post = await this.dataSource.query(
      `
        SELECT *
        FROM "Posts" p
               JOIN "ExtendedLikesInfo" e ON p.id = e.id
        WHERE p.id = $1
          AND "deletedAt" IS NULL
        `,
      [id],
    );

    return post[0] || null;
  }

  async update(body: UpdatePostDto) {
    return await this.dataSource.query(
      `
        UPDATE "Posts"
        SET title              = $1,
            "shortDescription" = $2,
            content            = $3,
            "updatedAt"        = NOW()
        WHERE id = $4
          AND "deletedAt" IS NULL
        RETURNING id
      `,
      [
        body.body.title,
        body.body.shortDescription,
        body.body.content,
        body.postId,
      ],
    );
  }

  async updateCounters(likesCount: number, dislikesCount: number, id: string) {
    await this.dataSource.query(
      `
        UPDATE "ExtendedLikesInfo" e
        SET "likesCount"   = $1,
            "dislikesCount" = $2
        FROM "Posts" p
        WHERE p.id = e.id
          AND p.id = $3
          AND p."deletedAt" IS NULL
      `,
      [likesCount, dislikesCount, id],
    );
  }

  async softDelete(id: string) {
    return await this.dataSource.query(
      `
        UPDATE "Posts"
        SET "deletedAt" = NOW()
        WHERE id = $1
          AND "deletedAt" IS NULL
        RETURNING id;
      `,
      [id],
    );
  }
}
