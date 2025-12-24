import {
    IsBoolean,
    IsEmail,
    IsOptional,
    IsString,
    MaxLength,
    IsInt,
  } from 'class-validator';
  
  export class UpdateCustomerDto {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;
  
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

    @IsOptional()
    @IsInt()
    legacyId?: number;
  
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
  }
  