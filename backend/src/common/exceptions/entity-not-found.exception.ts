import { NotFoundException } from '@nestjs/common';
import { ErrorTypes } from './error-types';

export class EntityNotFoundException extends NotFoundException {
  constructor(entityName: string) {
    super({
      error: ErrorTypes.ENTITY_NOT_FOUND,
      message: `${entityName} not found`,
    });
  }
}