import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  // uploads 디렉토리 생성 확인
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: [
      'https://frontend-production-0105.up.railway.app',
      'http://localhost:3000',
      'https://*.up.railway.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`Application is running on port ${port}`);
}

bootstrap();
