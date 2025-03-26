import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { InquiryService } from './inquiry.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

@Controller('inquiry')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('document', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @Body() createInquiryDto: CreateInquiryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('Received DTO:', JSON.stringify(createInquiryDto));

    // franchiseTypes가 undefined 또는 문자열이면 배열로 변환
    if (!createInquiryDto.franchiseTypes) {
      createInquiryDto.franchiseTypes = [];
    } else if (typeof createInquiryDto.franchiseTypes === 'string') {
      createInquiryDto.franchiseTypes = [createInquiryDto.franchiseTypes];
    }

    // DTO가 객체인지 확인 후 타입 변환 진행
    if (typeof createInquiryDto === 'object' && createInquiryDto !== null) {
      if ('franchiseType[]' in createInquiryDto) {
        const franchiseTypeValue = createInquiryDto['franchiseType[]'];

        if (Array.isArray(franchiseTypeValue)) {
          createInquiryDto.franchiseTypes = franchiseTypeValue.map((item) =>
            typeof item === 'string' ? item : JSON.stringify(item),
          );
        } else if (typeof franchiseTypeValue === 'string') {
          createInquiryDto.franchiseTypes = [franchiseTypeValue];
        } else if (
          franchiseTypeValue !== null &&
          franchiseTypeValue !== undefined
        ) {
          createInquiryDto.franchiseTypes = [
            JSON.stringify(franchiseTypeValue),
          ];
        }
        delete createInquiryDto['franchiseType[]'];
      }
    }

    // Boolean 값 처리 (폼 데이터에서 문자열로 올 수 있음)
    createInquiryDto.hasCarWashExperience =
      String(createInquiryDto.hasCarWashExperience).toLowerCase() === 'true';
    createInquiryDto.hasLandOwnership =
      String(createInquiryDto.hasLandOwnership).toLowerCase() === 'true';

    console.log('Processed DTO:', JSON.stringify(createInquiryDto));
    return this.inquiryService.create(createInquiryDto, file);
  }
}
