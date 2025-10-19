import { Test, TestingModule } from '@nestjs/testing';
import { UsersSuperAdminController } from './users-super-adminController';
import { UsersRepository } from '../infrastructure/users.repository';

describe('UsersController', () => {
  let controller: UsersSuperAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersSuperAdminController],
      providers: [UsersRepository],
    }).compile();

    controller = module.get<UsersSuperAdminController>(UsersSuperAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
