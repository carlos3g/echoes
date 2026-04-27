import { PasswordChangeRequestRepositoryContract } from '@app/auth/contracts/password-change-request-repository.contract';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { DeleteUsedPasswordChangeRequestTask } from './delete-used-password-change-request.task';

const makePasswordChangeRequestRepositoryMock = () => ({
  deleteUsed: jest.fn(),
});

describe('DeleteUsedPasswordChangeRequestTask', () => {
  let task: DeleteUsedPasswordChangeRequestTask;
  let passwordChangeRequestRepository: PasswordChangeRequestRepositoryContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUsedPasswordChangeRequestTask,
        {
          provide: PasswordChangeRequestRepositoryContract,
          useFactory: makePasswordChangeRequestRepositoryMock,
        },
      ],
    }).compile();

    task = module.get<DeleteUsedPasswordChangeRequestTask>(DeleteUsedPasswordChangeRequestTask);
    passwordChangeRequestRepository = module.get<PasswordChangeRequestRepositoryContract>(
      PasswordChangeRequestRepositoryContract
    );
  });

  it('should call deleteUsed on the repository when handle is executed', async () => {
    await task.handle();

    expect(passwordChangeRequestRepository.deleteUsed).toHaveBeenCalled();
  });
});
