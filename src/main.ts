import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import { CoreConfig } from './core/config/core.config';
import { initAppModule } from './init-app-module';

async function bootstrap() {
  const dynamicAppModule = await initAppModule() ;
  const app = await NestFactory.create(dynamicAppModule);

  const coreConfig = app.get(CoreConfig);
  const port = coreConfig.port;
  console.log('Application started');
  appSetup(app)

  app.enableCors();

  if (coreConfig.isSwaggerEnabled){
    console.log('Swagger is enabled');
  }

  await app.listen(port, () =>
    console.log(`Server is running on port ${port}`)
  );
}
bootstrap();
