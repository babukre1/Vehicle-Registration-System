import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RegistrationsModule } from './registration/registration.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    UsersModule,
    RegistrationsModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    StorageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
