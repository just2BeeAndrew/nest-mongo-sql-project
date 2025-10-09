import { HttpStatus, INestApplication, LoggerService } from '@nestjs/common';
import { Connection, DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule, options } from '../src/app.module';
import * as module from 'node:module';
import { appSetup } from '../src/setup/app.setup';
import { CreateUserDto } from '../src/modules/user-accounts/domain/dto/create-user.dto';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountsModule } from '../src/modules/user-accounts/user-accounts.module';

class TestLogger implements LoggerService {
  log(message: string) {}
  error(message: string, trace: string) {}
  warn(message: string) {}
  debug(message: string) {}
  verbose(message: string) {}
}

describe('Users (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(options), UserAccountsModule, AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appSetup(app);
    app.useLogger(new TestLogger());
    await app.init();

    dataSource = moduleFixture.get(DataSource);

    await dataSource.synchronize(true);
  });

  beforeEach(async () => {});

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  afterEach(async () => {});

  describe('/users (POST)', () => {
    const credentials = Buffer.from('admin:qwerty').toString('base64');
    const createUserDto = {
      login: 'Str1n9',
      password: '5tr1n9',
      email: 'andrew.dudal.1997@gmail.com',
    };

    it('should create user and return 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/sa/users')
        .set('Authorization', `Basic ${credentials}`)
        .send(createUserDto)
        .expect(HttpStatus.CREATED);
    });
  });
});
