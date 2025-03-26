import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { InquiryModule } from './inquiry/inquiry.module';
import { Inquiry } from './inquiry/entities/inquiry.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ .env 파일 로드

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'washblanc',
      entities: [Inquiry],
      synchronize: true, // 개발환경에서만 true
    }),

    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"WashBlanc" <noreply@washblanc.com>',
      },
    }),

    InquiryModule,
  ],
})
export class AppModule {}
