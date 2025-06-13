import { Test, TestingModule } from '@nestjs/testing';
import { GamblesService } from './gambles.service';

describe('GamblesService', () => {
  let service: GamblesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamblesService],
    }).compile();

    service = module.get<GamblesService>(GamblesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
