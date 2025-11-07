import { ArrayMinSize, IsArray, IsString, Length } from 'class-validator';
import {
  bodyConstants,
  correctAnswersConstants,
} from '../../constants/create-questions.constants';

export class CreateQuestionInput {
  @IsString()
  @Length(bodyConstants.minLength, bodyConstants.maxLength)
  body: string;

  @IsArray()
  @IsString({each: true})
  @ArrayMinSize(correctAnswersConstants.minSize)
  correctAnswers: string[];
}