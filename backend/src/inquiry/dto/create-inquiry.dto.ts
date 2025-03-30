// src/inquiry/dto/create-inquiry.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsEnum,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export enum ReferralSource {
  FRIEND_RECOMMENDATION = '지인추천',
  YOUTUBE = '유튜브',
  BLOG = '블로그',
  INSTAGRAM = '인스타그램',
  STORE_CUSTOMER = '매장이용고객',
  OTHER = '기타',
}

export enum DesiredLocation {
  SEOUL = '서울',
  INCHEON = '인천',
  GYEONGGI = '경기',
  GANGWON = '강원',
  CHUNGBUK = '충북',
  CHUNGNAM = '충남',
  JEONBUK = '전북',
  JEONNAM = '전남',
  GYEONGBUK = '경북',
  GYEONGNAM = '경남',
  JEJU = '제주',
}

export enum EstimatedInvestment {
  UNDER_100M = '1억 미만',
  BETWEEN_100M_500M = '1억~5억',
  BETWEEN_500M_1B = '5억~10억',
  UNDECIDED = '미정',
}

export class CreateInquiryDto {
  @IsArray()
  @IsNotEmpty()
  franchiseTypes: string[];

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEnum(DesiredLocation)
  @IsNotEmpty()
  desiredLocation: DesiredLocation;

  @IsEnum(ReferralSource)
  @IsNotEmpty()
  referralSource: ReferralSource;

  @IsEnum(EstimatedInvestment)
  @IsNotEmpty()
  estimatedInvestment: EstimatedInvestment;

  @IsBoolean()
  @IsNotEmpty()
  hasCarWashExperience: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hasLandOwnership: boolean;

  @IsOptional()
  document?: Express.Multer.File;

  @IsString()
  startupSchedule: string; // 창업예정일정

  @IsString()
  @IsOptional()
  assetDetails?: string; // 자본 및 부동산 보유내용 (선택)
}
