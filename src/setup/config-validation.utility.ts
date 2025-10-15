import { validateSync } from 'class-validator';

export const configValidationUtility = {
  validateConfig: (config: any) => {
    const errors = validateSync(config);
    if (errors.length > 0) {
      const sortedMessages = errors
        .map((error) => Object.values(error.constraints || {}).join(', '))
        .join('; ');
      throw new Error('Validation failed: ' + sortedMessages);
    }
  },

  getEnumValues<T extends Record<string, string>>(enumObj: T): string[] {
    return Object.values(enumObj);
  },
};
