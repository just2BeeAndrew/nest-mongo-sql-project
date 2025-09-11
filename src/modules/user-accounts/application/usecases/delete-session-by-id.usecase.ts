import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../infrastructure/sessions.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';

export class DeleteSessionByIdCommand {
  constructor(
    public userId: string,
    public deviceId: string,
    public uriParam: string,
  ) {}
}

@CommandHandler(DeleteSessionByIdCommand)
export class DeleteSessionByIdUseCase
  implements ICommandHandler<DeleteSessionByIdCommand>
{
  constructor(private readonly sessionRepository: SessionsRepository) {}

  async execute(command: DeleteSessionByIdCommand) {
    const session = await this.sessionRepository.findSessionById(
      command.uriParam,
    );
    if (!session) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Not found',
        extensions: [{ message: 'device not found', key: 'device' }],
      });
    }

    if (session.userId !== command.userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
        message: 'Forbidden',
        extensions: [{ message: 'User is not owner', key: 'user' }],
      });
    }

    await this.sessionRepository.softDeleteSession(command.deviceId)
  }
}
