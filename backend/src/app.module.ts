import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/db.module';

@Module({
  imports: [UserModule, DatabaseModule],
})
export class AppModule {}
