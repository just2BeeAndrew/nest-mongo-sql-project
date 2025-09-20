import { Injectable } from '@nestjs/common';

import { DomainException } from '../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../core/exception/filters/domain-exception-codes';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateBlogDomainDto } from '../domain/dto/create-blog.domain.dto';

@Injectable()
export class BlogsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createBlog(dto: CreateBlogDomainDto) {
    const user = await this.dataSource.query(
      `
    INSERT INTO "Blogs" (name, description, "websiteUrl")
    VALUES ($1, $2, $3)
    RETURNING id
    `,
      [dto.name, dto.description, dto.websiteUrl],
    );

    return user[0].id;
  }

  async findById(id: string){
    // return this.BlogModel.findOne({
    //   _id: id,
    //   deletedAt: null,
    // });
  }

  async getBlogByIdOrNotFoundFail(id: string) {
    // const blog = await this.findById(id);
    //
    // if (!blog) {
    //   throw new DomainException({
    //     code: DomainExceptionCode.NotFound,
    //     message: 'Not Found',
    //     extensions: [{ message: 'Blog not found', key: 'blog' }],
    //   });
    // }
    //
    // return blog;
  }
}
