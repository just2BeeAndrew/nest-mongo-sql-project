import { IsStringWithTrim } from '../../../../core/decorators/validation/is-string-with-trim';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class RegistrationEmailResendingInputDto {
  @IsStringWithTrim()
  @IsNotEmpty()
  @IsEmail()
  @Matches(/^[\w.-]+@([\w-]+\.)+[\w-]{2,}$/, {
    message: 'Invalid email format',
  })
  email: string;
}
