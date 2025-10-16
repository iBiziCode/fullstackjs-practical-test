import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
 
  @IsNotEmpty()
  @IsIn(['admin', 'user'])
  role: string;

  @IsNotEmpty()
  @IsIn(['active', 'inactive'])
  status: string;
}
