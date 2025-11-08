export class QuestionRaw {
  id: string;
  body: string;
  correctAnswer: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;

}

export class QuestionViewDto {
  id: string;
  body: string;
  correctAnswer: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;

  static mapToView(question: QuestionRaw): QuestionViewDto {
    const dto = new QuestionViewDto();

    dto.id = question.id;
    dto.body = question.body;
    dto.correctAnswer = question.correctAnswer;
    dto.published = question.published;
    dto.createdAt = question.createdAt.toISOString();
    dto.updatedAt = question.updatedAt.toISOString();

    return dto;
  }
}