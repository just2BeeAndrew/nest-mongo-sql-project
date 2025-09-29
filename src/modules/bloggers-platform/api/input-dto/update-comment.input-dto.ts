import { IsNotEmpty } from 'class-validator';
import { IsStringTrimAndLength } from '../../../../core/decorators/validation/is-string-trim-and-length';
import { commentConstant } from '../../constants/comments.constants';

export class UpdateCommentInputDto {
  @IsStringTrimAndLength(commentConstant.minLength, commentConstant.maxLength)
  @IsNotEmpty()
  content: string;
}
