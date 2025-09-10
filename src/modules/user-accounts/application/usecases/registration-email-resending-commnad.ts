import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class RegistrationEmailResendingCommnad{
  public email: string;
}

@CommandHandler(RegistrationEmailResendingCommnad)
export class RegistrationEmailResendingUseCase implements ICommandHandler<RegistrationEmailResendingCommnad{
  constructor() {
  }

  async execute(command: RegistrationEmailResendingCommnad) {}
}