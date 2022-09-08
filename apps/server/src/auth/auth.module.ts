import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RegistrationService } from '../registration/registration.service';
import { AuthService } from './auth.service';
import {StatesService} from '../states/states.service';

@Module({
	controllers: [AuthController],
	providers: [AuthService, RegistrationService, StatesService],
})
export class AuthModule {}
