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

    // franchiseTypes 처리
    if (!createInquiryDto.franchiseTypes) {
      createInquiryDto.franchiseTypes = [];
    } else if (!Array.isArray(createInquiryDto.franchiseTypes)) {
      // 배열이 아닌 경우 배열로 변환
      createInquiryDto.franchiseTypes = [createInquiryDto.franchiseTypes];
    }

    // Boolean 값 처리
    createInquiryDto.hasCarWashExperience =
      String(createInquiryDto.hasCarWashExperience).toLowerCase() === 'true';
    createInquiryDto.hasLandOwnership =
      String(createInquiryDto.hasLandOwnership).toLowerCase() === 'true';

    console.log('Processed DTO:', JSON.stringify(createInquiryDto));
    return this.inquiryService.create(createInquiryDto, file);
  }
}
