import { IsEmail, IsIn, IsNotEmpty, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  @Transform(({ value }) => value ? value.toLowerCase() : value)
  @ApiProperty({ example: 'john@example.com', description: 'User email address' })
  email: string;
 
  @IsNotEmpty()
  @MaxLength(25)
  @Transform(({ value }) => value ? value.toLowerCase() : value)
  @ApiProperty({ example: 'admin', description: 'User role (e.g., admin, user)' })
  role: string;

  @IsNotEmpty()
  @Transform(({ value }) => value ? value.toLowerCase() : value)
  @IsIn(['active', 'inactive'])
  @ApiProperty({ example: 'active', description: 'User status'})
  status: string;
}
