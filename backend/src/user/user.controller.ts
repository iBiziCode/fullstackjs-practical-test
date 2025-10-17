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
import { Response } from 'express';
import { Res } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }
  @Get('public-key')
  async getPublicKey() {
    return this.userService.getPublicKey();
  }
  @Get('export')
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
  async getStats() {
    return this.userService.getStats();
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
