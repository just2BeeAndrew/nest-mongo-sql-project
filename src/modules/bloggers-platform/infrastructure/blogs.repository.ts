import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Blog } from '../domain/entities/blog.entity';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
  ) {}

  async saveBlog(blog: Blog): Promise<Blog> {
    return this.blogRepository.save(blog);
  }

  async findById(id: string) {
    return await this.blogRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }
}
