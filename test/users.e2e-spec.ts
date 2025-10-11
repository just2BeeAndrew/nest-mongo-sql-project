import { HttpStatus, INestApplication, LoggerService } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { appSetup } from '../src/setup/app.setup';
import request from 'supertest';
import { User } from '../src/modules/user-accounts/domain/entities/user.entity';
import { AccountData } from '../src/modules/user-accounts/domain/entities/account-data.entity';

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
  let userRepository: Repository<User>;
  let accountDataRepository: Repository<AccountData>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appSetup(app);
    app.useLogger(new TestLogger());
    await app.init();

    dataSource = moduleFixture.get(DataSource);

    userRepository = dataSource.getRepository(User);
    accountDataRepository = dataSource.getRepository(AccountData);

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
