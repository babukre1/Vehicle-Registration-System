import { RegistrationStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateRegistrationStatusDto {
  @IsEnum(RegistrationStatus)
  status!: RegistrationStatus; // APPROVED or REJECTED (PENDING usually not used here)

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}