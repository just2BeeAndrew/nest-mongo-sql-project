import { IsStringWithTrim } from '../../../../core/decorators/validation/is-string-with-trim';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class RegistrationEmailResendingInputDto {
  @IsStringWithTrim()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
