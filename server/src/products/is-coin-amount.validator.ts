import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsCoinAmount(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isCoinAmount',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions || {
        message: `${propertyName} must be one of [5, 10, 20, 50, 100]`,
      },
      validator: {
        validate(value: any) {
          return (
            typeof value === 'number' &&
            [5, 10, 20, 50, 100].some((v) => v == value)
          );
        },
      },
    });
  };
}
