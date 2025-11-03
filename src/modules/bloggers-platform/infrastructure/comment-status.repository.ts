import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentStatus } from '../domain/entities/comment-status.entity';

@Injectable()
export class CommentStatusRepository {
  constructor(
    @InjectRepository(CommentStatus)
    private commentStatusRepository: Repository<CommentStatus>,
  ) {}

  async saveStatus(commentStatus: CommentStatus): Promise<CommentStatus> {
    return this.commentStatusRepository.save(commentStatus);
  }

  async find(userId: string, postId: string) {
    return await this.commentStatusRepository.findOne({
      where: { userId: userId, commentId: postId },
    });
  }
}
