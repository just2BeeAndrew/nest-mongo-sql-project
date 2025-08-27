import { applyDecorators } from '@nestjs/common';
import { IsString, Length } from 'class-validator';
import { Trim } from '../transform/trim';

export const IsStringWithTrim = () =>
  applyDecorators(IsString(),Trim());