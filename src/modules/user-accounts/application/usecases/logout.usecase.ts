import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SessionsRepository } from '../../infrastructure/sessions.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';

export class LogoutCommand {
  constructor(
    public userId: string,
    public deviceId: string,
  ) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand> {
  constructor(private readonly sessionRepository: SessionsRepository) {}

  async execute(command: LogoutCommand) {
    const session = await this.sessionRepository.findSessionById(
      command.deviceId,
    );
    if (!session) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        extension: [{ message: 'Session not found', field: 'device' }],
      });
    }

    await this.sessionRepository.deleteSession(command.deviceId);
  }
}
