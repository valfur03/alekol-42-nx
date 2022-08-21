import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RegistrationService } from '../registration/registration.service';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, RegistrationService],
})
export class AuthModule {}
