import { Controller, GatewayTimeoutException, Get, Param, Redirect } from '@nestjs/common';
import configuration from '../conf/configuration';
import { RegistrationService } from '../registration/registration.service';
import { StateData } from './interfaces/state-data.interface';

const MAX_ITERATIONS = 20;

@Controller('auth/register')
export class AuthController {
	constructor(private registrationService: RegistrationService) {}

	@Get()
	@Redirect()
	register(@Param('state') state: string) {
		let data: StateData | null = null;
		if (state) data = this.registrationService.fetchStateData(state);
		else {
			let i = 0;
			while (data === null) {
				if (i++ >= MAX_ITERATIONS) throw new GatewayTimeoutException();
				data = this.registrationService.setStateData(this.registrationService.initStateData());
			}
		}
		if (data.access_token.ft === null) return { url: configuration().ft.authorization_url(state) };
		else if (data.access_token.discord === null) return { url: configuration().discord.authorization_url(state) };
		return { url: configuration().front_end.url };
	}
}
