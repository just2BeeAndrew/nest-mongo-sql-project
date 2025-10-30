import { nameConstants, descriptionConstants, websiteUrlConstants } from '../../constants/blogs.constants';
import { IsUrl} from 'class-validator';
import { IsStringTrimAndLength } from '../../../../core/decorators/validation/is-string-trim-and-length';

export class CreateBlogInputDto {
  @IsStringTrimAndLength(nameConstants.minLength, nameConstants.maxLength)
  name: string;

  @IsStringTrimAndLength(descriptionConstants.minLength, descriptionConstants.maxLength)
  description: string;

  @IsStringTrimAndLength(websiteUrlConstants.minLength, websiteUrlConstants.maxLength)
  @IsUrl()
  websiteUrl: string;
}
