import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import { CoreConfig } from './core/config/core.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const coreConfig = app.get(CoreConfig);
  const port = coreConfig.port;
  console.log('Application started');
  appSetup(app)

  app.enableCors();

  await app.listen(port, () =>
    console.log(`Server is running on port ${port}`)
  );
}
bootstrap();
