import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../infrastructure/sessions.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';

export class DeleteSessionsExcludeCurrentCommand {
  constructor(
    public userId: string,
    public deviceId: string,
  ) {}
}

@CommandHandler(DeleteSessionsExcludeCurrentCommand)
export class DeleteSessionsExcludeCurrentUseCase
  implements ICommandHandler<DeleteSessionsExcludeCurrentCommand>
{
  constructor(private readonly sessionRepository: SessionsRepository) {}

  async execute(command: DeleteSessionsExcludeCurrentCommand) {
    const session = await this.sessionRepository.findSessionById(
      command.deviceId,
    );
    if (!session) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Not found',
        extensions: [{message: "Session not found", key: "session"}]
      });
    }

    if (session.userId !== command.userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
        message: 'Forbidden',
        extensions: [{message: "User is not owner", key: "user"}]
      });
    }

    await this.sessionRepository.softDeleteSessionExcludeCurrent(
      command.userId,
      command.deviceId,
    );
  }
}
