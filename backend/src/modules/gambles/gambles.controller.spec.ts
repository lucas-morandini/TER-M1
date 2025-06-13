import { Test, TestingModule } from '@nestjs/testing';
import { GamblesController } from './gambles.controller';

describe('GamblesController', () => {
  let controller: GamblesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamblesController],
    }).compile();

    controller = module.get<GamblesController>(GamblesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
