import { IsStringTrimAndLength } from '../../../../core/decorators/validation/is-string-trim-and-length';
import { IsStringWithTrim } from '../../../../core/decorators/validation/is-string-with-trim';

export class NewPasswordInputDto {
  @IsStringTrimAndLength(6, 20)
  newPassword: string;

  @IsStringWithTrim()
  recoveryCode: string;
}