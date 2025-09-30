import { LikeStatus } from '../../../../core/dto/like-status';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CalculateStatusCountCommand {
  constructor(
    public likesCount: number,
    public dislikesCount: number,
    public existingStatus: LikeStatus,
    public newStatus: LikeStatus,
  ) {}
}

@CommandHandler(CalculateStatusCountCommand)
export class CalculateStatusCountUseCase
  implements ICommandHandler<CalculateStatusCountCommand>
{
  constructor() {}

  async execute(
    command: CalculateStatusCountCommand,
  ): Promise<{ likesCount: number; dislikesCount: number }> {
    if (
      command.existingStatus === LikeStatus.Like &&
      command.newStatus !== LikeStatus.Like
    ) {
      command.likesCount -= 1;
    }

    if (
      command.existingStatus === LikeStatus.Dislike &&
      command.newStatus !== LikeStatus.Dislike
    ) {
      command.dislikesCount -= 1;
    }

    if (
      command.newStatus === LikeStatus.Like &&
      command.existingStatus !== LikeStatus.Like
    ) {
      command.likesCount += 1;
    }

    if (
      command.newStatus === LikeStatus.Dislike &&
      command.existingStatus !== LikeStatus.Dislike
    ) {
      command.dislikesCount += 1;
    }

    return {
      likesCount: command.likesCount,
      dislikesCount: command.dislikesCount,
    };
  }
}
