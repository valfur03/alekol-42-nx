import { BadRequestException, Controller, GatewayTimeoutException, Get, InternalServerErrorException, Query, Redirect } from '@nestjs/common';
import { RegistrationService } from '../registration/registration.service';
import { AuthService } from './auth.service';
import { StateData } from './interfaces/state-data.interface';
import { NestRedirection } from '@alekol/data';

const MAX_ITERATIONS = 20;

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, private registrationService: RegistrationService) {}

	@Get('register')
	@Redirect()
	register(@Query('state') state: string): NestRedirection {
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
		return { url: this.registrationService.getNextServiceURL(data) };
	}

	@Get('42')
	@Redirect()
	async authWith42(@Query('code') code: string, @Query('state') state: string): Promise<NestRedirection> {
		let data: StateData = this.registrationService.fetchStateData(state);
		if (data === null) throw new BadRequestException('State is invalid');
		const auth = await this.authService.get42AccessToken(code);
		if (auth === null) throw new InternalServerErrorException();
		const user = await this.authService.get42User(auth.access_token);
		if (user === null) throw new InternalServerErrorException();
		data = this.registrationService.setStateData({ ...data, ft_id: user.id.toString(), ft_login: user.login })
		return { url: this.registrationService.getNextServiceURL(data) };
	}
}
