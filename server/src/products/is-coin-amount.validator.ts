import { registerDecorator, ValidationOptions } from 'class-validator';
import { AVAILABLE_COINS_DESCENDING } from './vending-machine.service';

export function IsCoinAmount(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isCoinAmount',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions || {
        message: `${propertyName} must be one of [${AVAILABLE_COINS_DESCENDING}]`,
      },
      validator: {
        validate(value: any) {
          return (
            typeof value === 'number' &&
            AVAILABLE_COINS_DESCENDING.some((v) => v == value)
          );
        },
      },
    });
  };
}
