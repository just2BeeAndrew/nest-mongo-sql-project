import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import { Comment } from '../domain/entities/comment.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  async saveComment(comment: Comment): Promise<Comment> {
    return this.commentRepository.save(comment);
  }

  async findById(id: string) {
    return await this.commentRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: {
        likesInfo: true,
      },
    });
  }

  async softDelete(commentId: string) {
    return await this.commentRepository.softDelete({id: commentId});
  }
}
