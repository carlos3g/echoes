import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { BCryptService } from './bcrypt.service';

describe('BCryptService', () => {
  let service: BCryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BCryptService],
    }).compile();

    service = module.get<BCryptService>(BCryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
