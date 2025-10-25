import { Test, TestingModule } from '@nestjs/testing';
import { UsersSuperAdminOntroller } from './users-super-admin.сontroller';
import { UsersRepository } from '../infrastructure/users.repository';

describe('UsersController', () => {
  let controller: UsersSuperAdminOntroller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersSuperAdminOntroller],
      providers: [UsersRepository],
    }).compile();

    controller = module.get<UsersSuperAdminOntroller>(UsersSuperAdminOntroller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
