import { IsEmail, Matches } from 'class-validator';
import {
  loginConstants,
  passwordConstants,
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

  email: string;
}
