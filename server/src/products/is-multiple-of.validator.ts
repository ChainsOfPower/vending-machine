import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsMultipleOf(
  property: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isMultipleOf',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions || {
        message: `${propertyName} must be multiple of ${property}`,
      },
      validator: {
        validate(value: any) {
          return typeof value === 'number' && value % property === 0;
        },
      },
    });
  };
}
