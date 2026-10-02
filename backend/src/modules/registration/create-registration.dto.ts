import { IsEmail, IsInt, IsOptional, IsString, Min, ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVehicleForRegistrationDto {
  @IsString()
  plateNumber!: string;

  @IsString()
  make!: string;

  @IsString()
  model!: string;

  @IsInt()
  @Min(1900)
  @Type(() => Number)
  year!: number;

  @IsString()
  color!: string;

  @IsString()
  chassisNumber!: string;

  @IsString()
  engineNumber!: string;

  @IsString()
  vehicleType!: string;
}

export class CreateOwnerForRegistrationDto {
  @IsString()
  fullName!: string;

  @IsString()
  nationalId!: string;

  @IsString()
  phoneNumber!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  address!: string;
}

export class CreateRegistrationDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateVehicleForRegistrationDto)
  vehicle!: CreateVehicleForRegistrationDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => CreateOwnerForRegistrationDto)
  owner!: CreateOwnerForRegistrationDto;
}
