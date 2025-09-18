export class ErrorTypes {
  static readonly ENTITY_NOT_FOUND = 'ENTITY_NOT_FOUND';
  static readonly VALIDATION_ERROR = 'VALIDATION_ERROR';
  static readonly DUPLICATE_ENTRY = 'DUPLICATE_ENTRY';
  static readonly UNAUTHORIZED = 'UNAUTHORIZED';
  static readonly FORBIDDEN = 'FORBIDDEN';
  static readonly INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}