import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 🔓 INDISPENSABLE : Autorise ton app mobile à parler au serveur
  app.enableCors(); 
  
  await app.listen(3000, '0.0.0.0');
}
bootstrap();