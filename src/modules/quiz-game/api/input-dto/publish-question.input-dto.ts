import { IsBoolean, IsNotEmpty } from 'class-validator';

export class PublishQuestionInputDTO {
  @IsBoolean()
  @IsNotEmpty()
  published: boolean;
}