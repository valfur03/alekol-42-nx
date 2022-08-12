import { Controller, Get, Param, Redirect } from '@nestjs/common';
import configuration from '../conf/configuration';
import { RegistrationService } from '../registration/registration.service';
import { StateData } from './interfaces/state-data.interface';

@Controller('auth/register')
export class AuthController {
	constructor(private registrationService: RegistrationService) {}

	@Get()
	@Redirect()
	register(@Param('state') state: string) {
		const data: StateData = this.registrationService.fetchStateData(state);
		if (data.access_token.ft === null) return { url: configuration().ft.authorization_url(state) };
		else if (data.access_token.discord === null) return { url: configuration().discord.authorization_url(state) };
		return { url: configuration().front_end.url };
	}
}
