import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { RolesEnum } from '../../../common/enums/roles.enum';

export class RegisterDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(RolesEnum)
  role!: RolesEnum;
}