import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @MaxLength(255)
  name: string;            // Praxisname

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  street?: string;         // Straße + Hausnummer zusammen

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  phone?: string;          // Festnetz
}
