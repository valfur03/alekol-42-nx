import { BadRequestException, Controller, GatewayTimeoutException, Get, Query, Redirect } from '@nestjs/common';
import configuration from '../conf/configuration';
import { RegistrationService } from '../registration/registration.service';
import { StateData } from './interfaces/state-data.interface';

const MAX_ITERATIONS = 20;

@Controller('auth')
export class AuthController {
	constructor(private registrationService: RegistrationService) {}

	@Get('register')
	@Redirect()
	register(@Query('state') state: string) {
		let data: StateData | null = null;
		if (state) {
			data = this.registrationService.fetchStateData(state);
			if (data === null) throw new BadRequestException();
		} else {
			let i = 0;
			while (data === null) {
				if (i++ >= MAX_ITERATIONS) throw new GatewayTimeoutException();
				data = this.registrationService.setStateData(this.registrationService.initStateData());
			}
		}
		if (data.ft_login === null || data.ft_id === null) return { url: configuration().ft.authorization_url(state) };
		else if (data.discord_id === null) return { url: configuration().discord.authorization_url(state) };
		return { url: configuration().front_end.url };
	}
}
