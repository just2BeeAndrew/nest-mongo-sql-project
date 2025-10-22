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
        extension: [{ message: 'Session not found', field: 'session' }],
      });
    }

    if (session.userId !== command.userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
        extension: [{ message: 'User is not owner', field: 'user' }],
      });
    }

    await this.sessionRepository.deleteSessionExcludeCurrent(
      command.userId,
      command.deviceId,
    );
  }
}
