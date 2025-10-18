import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as protobuf from 'protobufjs';
import * as path from 'path';
import { Res } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 500, description: 'Failed to create user' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('public-key')
    @ApiOperation({
    summary: 'Get the public RSA key',
    description:
      'Returns the public RSA key in PEM format.',
  })
  @ApiResponse({
    status: 200,
    description: 'Public RSA key in PEM format.',
    schema: { example: '-----BEGIN PUBLIC KEY-----\\nMIIBIjANBgkqhk...\\n-----END PUBLIC KEY-----' },
  })
  async getPublicKey() {
    return this.userService.getPublicKey();
  }


  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async findAll() {
    return this.userService.findAll();
  }
  @Get('export')
    @ApiOperation({
    summary: 'Export users in protobuf format',
    description:
      'Returns all users serialized in Protocol Buffers format.',
  })
    @ApiResponse({
    status: 200,
    description: 'Binary Protobuf stream containing all users.',
    schema: { type: 'string', format: 'binary' },
  })
  async exportProto(@Res() res) {
    const users = await this.userService.findAll();

    const protoPath = path.join(__dirname, '../../src/proto/user.proto');
    const root = await protobuf.load(protoPath);
    const UserList = root.lookupType('users.UserList');

    const buffer = UserList.encode(UserList.create({ users })).finish();

    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(buffer);
  }
  @Get('stats')
  @ApiOperation({
    summary: 'Get user creation stats for the last 7 days',
    description:
      'Returns an array of date-count pairs showing how many users were created each day in the past week. Useful for charting daily trends on the frontend.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of daily user creation counts for the last 7 days.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          date: { type: 'string', example: '2025-10-17' },
          count: { type: 'number', example: 3 },
        },
      },
    },
  })
  async getStats() {
    return this.userService.getStats();
  }
  @Get(':id')
    @ApiOperation({
    summary: 'Get user by ID',
    description: 'Fetches a user record by their unique UUID.',
  })
  @ApiResponse({ status: 200, description: 'User found and returned' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID', description: 'Updates the role or status of an existing user.' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Failed to update user' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Failed to delete user' })
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
