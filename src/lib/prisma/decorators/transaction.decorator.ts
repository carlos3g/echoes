import { PrismaTransactionScope } from '@app/lib/prisma/transaction-scope';
import { Inject } from '@nestjs/common';

interface ThisType {
  transactionScope: PrismaTransactionScope;
}

interface OriginalMethod {
  (): Promise<unknown>;
}

export function Transaction(): MethodDecorator {
  const injectService = Inject(PrismaTransactionScope);

  return (target: object, propertyKey: string | symbol, propertyDescriptor: PropertyDescriptor) => {
    injectService(target, 'transactionScope');

    const originalMethod: OriginalMethod = propertyDescriptor.value as OriginalMethod;

    // eslint-disable-next-line no-param-reassign
    propertyDescriptor.value = async function bindTransactionScopeCallback(this: ThisType) {
      const { transactionScope } = this;

      return transactionScope.run(originalMethod.bind(this));
    };

    return propertyDescriptor;
  };
}
