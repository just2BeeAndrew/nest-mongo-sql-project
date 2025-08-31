import { IsEmail, Matches } from 'class-validator';
import {
  loginConstants,
  passwordConstants,
  emailConstants,
} from '../../constants/users.constants';
import { IsStringWithTrim } from '../../../../core/decorators/validation/is-string-with-trim';
import { IsStringTrimAndLength } from '../../../../core/decorators/validation/is-string-trim-and-length';

export class CreateUserInputDto {
  @IsStringTrimAndLength(loginConstants.minLength, loginConstants.maxLength)
  @Matches(loginConstants.match)
  login: string;

  @IsStringTrimAndLength(
    passwordConstants.minLength,
    passwordConstants.maxLength,
  )
  password: string;

  @IsStringWithTrim()
  @IsEmail()
  @Matches(emailConstants.match, { message: 'Invalid email format' })
  email: string;
}
