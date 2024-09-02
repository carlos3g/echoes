/* eslint-disable max-classes-per-file */
import { Transaction } from '@app/lib/prisma/decorators/transaction.decorator';
import { PrismaTransactionScopeService } from '@app/lib/prisma/services/transaction-scope.service';

const makeTransactionScopeServiceMock = () =>
  ({
    run: jest.fn(),
  }) as unknown as PrismaTransactionScopeService;

describe('Transaction Decorator', () => {
  let mockTransactionScopeService: PrismaTransactionScopeService;

  beforeEach(() => {
    mockTransactionScopeService = makeTransactionScopeServiceMock();
  });

  it('should inject PrismaTransactionScopeService into the target', () => {
    const injectSpy = jest.spyOn(Reflect, 'defineMetadata');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class TestClass {
      @Transaction()
      public async testMethod() {
        return new Promise((resolve) => {
          resolve('result');
        });
      }
    }

    expect(injectSpy).toHaveBeenCalledWith(
      'self:properties_metadata',
      [{ key: 'transactionScope', type: PrismaTransactionScopeService }],
      expect.anything()
    );
  });

  it('should call the original method within a transaction', async () => {
    (mockTransactionScopeService.run as jest.Mock).mockImplementation((callback: () => void) => callback());

    class TestClass {
      public transactionScope = mockTransactionScopeService;

      @Transaction()
      public async testMethod(): Promise<string> {
        return new Promise((resolve) => {
          resolve('result');
        });
      }
    }

    const testInstance = new TestClass();
    const result = await testInstance.testMethod();

    expect(mockTransactionScopeService.run).toHaveBeenCalled();
    expect(result).toBe('result');
  });

  it('should pass the arguments to the original method', async () => {
    (mockTransactionScopeService.run as jest.Mock).mockImplementation((callback: () => void) => callback());
    const mockMethod = jest.fn().mockResolvedValue('result');

    class TestClass {
      public transactionScope = mockTransactionScopeService;

      @Transaction()
      public testMethod(arg1: string, arg2: number): Promise<string> {
        return mockMethod(arg1, arg2) as Promise<string>;
      }
    }

    const testInstance = new TestClass();
    const result = await testInstance.testMethod('test', 42);

    expect(mockMethod).toHaveBeenCalledWith('test', 42);
    expect(result).toBe('result');
  });

  it('should rethrow errors from the original method', async () => {
    (mockTransactionScopeService.run as jest.Mock).mockImplementation((callback: () => void) => callback());
    const error = new Error('Test error');
    const mockMethod = jest.fn().mockRejectedValue(error);

    class TestClass {
      public transactionScope = mockTransactionScopeService;

      @Transaction()
      public async testMethod() {
        return mockMethod() as Promise<string>;
      }
    }

    const testInstance = new TestClass();

    await expect(testInstance.testMethod()).rejects.toThrow(error);
    expect(mockMethod).toHaveBeenCalled();
    expect(mockTransactionScopeService.run).toHaveBeenCalled();
  });
});
