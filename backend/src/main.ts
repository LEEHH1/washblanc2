import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 특정 도메인 및 로컬 개발 환경 모두 허용하는 CORS 설정
  app.enableCors({
    origin: [
      'https://frontend-production-0105.up.railway.app', // Railway에 배포된 프론트엔드 도메인
      'http://localhost:3000', // 로컬 개발 환경
      'https://*.up.railway.app', // Railway의 모든 하위 도메인 허용
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // 환경 변수에서 포트를 가져오거나 기본값 4000 사용
  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`Application is running on port ${port}`);
}

bootstrap();
