import { IsStringTrimAndLength } from '../../../../core/decorators/validation/is-string-trim-and-length';
import { commentConstant } from '../../constants/comments.constants';

export class CreateCommentInputDto {
  @IsStringTrimAndLength(commentConstant.minLength, commentConstant.maxLength)
  content: string;
}