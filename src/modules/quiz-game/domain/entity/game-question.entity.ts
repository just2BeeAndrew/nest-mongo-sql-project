import { Entity } from 'typeorm';
import { BaseEntity } from '../../../../core/entities/base.entity';

@Entity('GameQuestion')
export class GameQuestion extends BaseEntity{}