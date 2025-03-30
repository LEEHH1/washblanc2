// src/inquiry/entities/inquiry.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Inquiry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-array', { default: [] })
  franchiseTypes: string[];

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  desiredLocation: string;

  @Column()
  referralSource: string;

  @Column()
  estimatedInvestment: string;

  @Column()
  hasCarWashExperience: boolean;

  @Column()
  hasLandOwnership: boolean;

  @Column({ nullable: true, type: 'varchar', default: null })
  documentUrl: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  startupSchedule: string; // 창업예정일정

  @Column({ nullable: true })
  assetDetails: string; // 자본 및 부동산 보유내용 (선택)
}
