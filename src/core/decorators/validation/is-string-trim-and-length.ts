import { IsStringWithTrim } from './is-string-with-trim';
import { Length } from 'class-validator';
import { applyDecorators } from '@nestjs/common';

export const IsStringTrimAndLength = (minLength: number, maxLength: number) =>
  applyDecorators(IsStringWithTrim(), Length(minLength, maxLength));