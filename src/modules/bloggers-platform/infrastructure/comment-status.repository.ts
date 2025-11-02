import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentStatus } from '../domain/entities/comment-status.entity';

@Injectable()
export class PostStatusRepository {
  constructor(
    @InjectRepository(CommentStatus)
    private commentStatusRepository: Repository<CommentStatus>,
  ) {}

  async find(userId: string, postId: string) {
    return await this.commentStatusRepository.findOne({
      where: { userId: userId, commentId: postId },
    });
  }
}
