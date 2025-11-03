import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Post } from '../domain/entities/post.entity';

@Injectable()
export class PostsRepository {
  constructor(
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
}
