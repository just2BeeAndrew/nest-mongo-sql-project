import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import { PostStatus } from '../domain/entities/post-status.entity';

@Injectable()
export class PostStatusRepository {
  constructor(
    @InjectRepository(PostStatus) private postStatusRepository: Repository<PostStatus>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async find(userId: string, postId: string) {
    return await this.postStatusRepository.findOne({
      where: { userId: userId, postId: postId, deletedAt: IsNull() },
    });
  }
}
