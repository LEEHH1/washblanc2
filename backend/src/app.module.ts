import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { InquiryModule } from './inquiry/inquiry.module';
import { Inquiry } from './inquiry/entities/inquiry.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // Railway에서 제공하는 연결 문자열 사용
      entities: [Inquiry],
      synchronize: false,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
      autoLoadEntities: true,
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
