import { IsEmail, IsIn, IsNotEmpty, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  @Transform(({ value }) => value ? value.toLowerCase() : value)
  email: string;
 
  @IsNotEmpty()
  @MaxLength(25)
  @Transform(({ value }) => value ? value.toLowerCase() : value)
  role: string;

  @IsNotEmpty()
  @Transform(({ value }) => value ? value.toLowerCase() : value)
  @IsIn(['active', 'inactive'])
  status: string;
}
