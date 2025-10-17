import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value ? value.toLowerCase() : value)
  email: string;
 
  @IsNotEmpty()
  @Transform(({ value }) => value ? value.toLowerCase() : value)
  @IsIn(['admin', 'user'])
  role: string;

  @IsNotEmpty()
  @Transform(({ value }) => value ? value.toLowerCase() : value)
  @IsIn(['active', 'inactive'])
  status: string;
}
