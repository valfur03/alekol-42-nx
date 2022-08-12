import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RegistrationService } from '../registration/registration.service';

@Module({
	controllers: [AuthController],
	providers: [RegistrationService],
})
export class AuthModule {}
