import { IsString, IsMongoId, IsArray, IsOptional } from 'class-validator';

export class CreateClassDto {
  @IsString()
  name!: string;

  @IsMongoId()
  teacher!: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  students?: string[];
}