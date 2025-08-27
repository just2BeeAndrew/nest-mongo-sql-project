import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { IsStringWithTrim } from '../../../../core/decorators/validation/is-string-with-trim';
//import { emailConstants } from '../../domain/users.entity';

export class PasswordRecoveryInputDto {
  @IsStringWithTrim()
  @IsNotEmpty()
  @IsEmail()
  //@Matches(emailConstants.match,{message: 'Invalid email format'})
  email: string;
}