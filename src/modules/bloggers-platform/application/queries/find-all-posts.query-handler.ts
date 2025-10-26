// import { FindPostsQueryParams } from '../../api/input-dto/find-posts-query-params.input-dto';
// import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
// import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
// import { PostsViewDto } from '../../api/view-dto/posts.view-dto';
// import { PostsQueryRepository } from '../../infrastructure/query/posts.query-repository';
//
// export class FindAllPostsQuery {
//   constructor(
//     public query: FindPostsQueryParams,
//     public userId?: string | null,
//   ) {}
// }
//
// @QueryHandler(FindAllPostsQuery)
// export class FindAllPostsQueryHandler
//   implements IQueryHandler<FindAllPostsQuery, PaginatedViewDto<PostsViewDto[]>>
// {
//   constructor(private readonly postsQueryRepository: PostsQueryRepository) {}
//
//   async execute(
//     query: FindAllPostsQuery,
//   ): Promise<PaginatedViewDto<PostsViewDto[]>> {
//     return await this.postsQueryRepository.findAll(
//       query.query,
//       query.userId ?? null,
//     );
//   }
// }
