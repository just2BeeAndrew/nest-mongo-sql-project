import { descriptionConstants, nameConstants, websiteUrlConstants } from '../../constants/blogs.constants';
import { Matches } from 'class-validator';
import { IsStringTrimAndLength } from '../../../../core/decorators/validation/is-string-trim-and-length';

export class UpdateBlogsInputDto {
  @IsStringTrimAndLength(nameConstants.minLength, nameConstants.maxLength)
  name: string;

  @IsStringTrimAndLength(descriptionConstants.minLength, descriptionConstants.maxLength)
  description: string;

  @IsStringTrimAndLength(websiteUrlConstants.minLength, websiteUrlConstants.maxLength)
  @Matches(websiteUrlConstants.match)
  websiteUrl: string;
}