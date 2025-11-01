import { UsersRepository } from '../../user-accounts/infrastructure/users.repository';
import { PostsRepository } from '../infrastructure/posts.repository';
import { DomainException } from '../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../core/exception/filters/domain-exception-codes';

export const checkExistingUserAndPost = async (
  userId: string,
  postId: string,
  usersRepository: UsersRepository,
  postsRepository: PostsRepository,
) => {
  const user = await usersRepository.findById(userId);
  if (!user) {
    throw new DomainException({
      code: DomainExceptionCode.NotFound,
      extension: [{ message: 'User not found', field: 'user' }],
    });
  }

  const post = await postsRepository.findById(postId);
  if (!post) {
    throw new DomainException({
      code: DomainExceptionCode.NotFound,
      extension: [{ message: 'Post not found', field: 'post' }],
    });
  }

  return { user, post };
};