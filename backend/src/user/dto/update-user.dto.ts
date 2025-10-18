import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsOptional, IsEmail, IsIn, IsNotEmpty, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
     @IsOptional()
      @IsEmail()
      @MaxLength(255)
      @Transform(({ value }) => value ? value.toLowerCase() : value)
      @ApiProperty({ example: 'john@example.com', description: 'User email address', required: false })
      email?: string;
     
     @IsOptional()
      @MaxLength(25)
      @Transform(({ value }) => value ? value.toLowerCase() : value)
      @ApiProperty({ example: 'admin', description: 'User role (e.g., admin, user)', required: false })
      role?: string;

        @IsOptional()
      @Transform(({ value }) => value ? value.toLowerCase() : value)
      @IsIn(['active', 'inactive'])
      @ApiProperty({ example: 'active', description: 'User status', required: false })
      status?: string;
}
