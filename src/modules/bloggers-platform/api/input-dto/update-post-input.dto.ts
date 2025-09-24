import { IsStringTrimAndLength } from '../../../../core/decorators/validation/is-string-trim-and-length';
import { contentConstants, shortDescriptionConstants, titleConstants } from '../../constants/posts.constants';

export class UpdatePostInputDto {
  @IsStringTrimAndLength(titleConstants.minLength, titleConstants.maxLength)
  title: string;

  @IsStringTrimAndLength(shortDescriptionConstants.minLength, shortDescriptionConstants.maxLength)
  shortDescription: string;

  @IsStringTrimAndLength(contentConstants.minLength, contentConstants.maxLength)
  content: string;
}