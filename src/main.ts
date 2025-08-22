import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('Application started');
  appSetup(app)

  app.enableCors();

  const PORT = process.env.PORT || 1963;

  await app.listen(PORT, () =>
    console.log(`Server is running on port ${PORT}`)
  );
}
bootstrap();
