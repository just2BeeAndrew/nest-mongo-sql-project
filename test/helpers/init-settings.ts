import { initAppModule } from '../../src/init-app-module';
import { Test, TestingModuleBuilder } from '@nestjs/testing';

export const initSettings = async () => {
  const dynamicAppModule = await initAppModule();
  const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [dynamicAppModule],
  });
};
