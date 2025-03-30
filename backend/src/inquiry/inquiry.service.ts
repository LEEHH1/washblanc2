import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { Inquiry } from './entities/inquiry.entity';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry)
    private inquiryRepository: Repository<Inquiry>,
    private mailerService: MailerService,
  ) {}

  async create(createInquiryDto: CreateInquiryDto, file?: Express.Multer.File) {
    // 새로운 문의 인스턴스 생성
    const inquiry = new Inquiry();

    // franchiseTypes가 없으면 빈 배열 설정
    if (!createInquiryDto.franchiseTypes) {
      createInquiryDto.franchiseTypes = [];
    }

    Object.assign(inquiry, {
      ...createInquiryDto,
      documentUrl: file ? file.filename : null,
    });

    // 데이터베이스에 저장
    const savedInquiry = await this.inquiryRepository.save(inquiry);

    // 가맹유형 문자열 생성
    const franchiseTypesMap: Record<string, string> = {
      detailingShop: '디테일링샵',
      selfCarWash: '셀프세차장',
      noBrush: '노브러쉬',
    };

    const franchiseTypesString =
      savedInquiry.franchiseTypes && savedInquiry.franchiseTypes.length > 0
        ? savedInquiry.franchiseTypes
            .map((type) => {
              const mappedType = franchiseTypesMap[type];
              return mappedType !== undefined ? mappedType : type;
            })
            .join(', ')
        : '선택 없음';

    // 이메일 전송 (첨부파일 추가)
    await this.mailerService.sendMail({
      to: 'dlghksgml3@gmail.com',
      subject: '새로운 가맹점 문의가 접수되었습니다',
      html: `
        <h1>새로운 가맹점 문의</h1>
        <p>가맹유형: ${franchiseTypesString}</p>
        <p>성함: ${savedInquiry.name}</p>
        <p>연락처: ${savedInquiry.phone}</p>
        <p>희망지역: ${savedInquiry.desiredLocation}</p>
        <p>유입경로: ${savedInquiry.referralSource}</p>
        <p>예상투자금: ${savedInquiry.estimatedInvestment}</p>
        <p>창업예정일정: ${savedInquiry.startupSchedule}</p>
        <p>세차장운영경험: ${savedInquiry.hasCarWashExperience ? '있음' : '없음'}</p>
        <p>토지소유여부: ${savedInquiry.hasLandOwnership ? '있음' : '없음'}</p>
        ${savedInquiry.assetDetails ? `<p>자본 및 부동산 보유내용: ${savedInquiry.assetDetails}</p>` : ''}
        ${file ? `<p>첨부파일: ${file.originalname}</p>` : ''}
      `,
      attachments: file
        ? [
            {
              filename: file.originalname,
              path: file.path,
            },
          ]
        : [],
    });

    return savedInquiry;
  }
}
