import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  IsInt,
  Min,
  IsBoolean,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  // Kd.-Nr
  @IsOptional()
  @IsInt()
  @Min(0)
  legacyId?: number;

  // Aktiv/Inaktiv
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
