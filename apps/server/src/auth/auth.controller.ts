import { BadRequestException, Controller, GatewayTimeoutException, Get, InternalServerErrorException, Query, Redirect } from '@nestjs/common';
import { RegistrationService } from '../registration/registration.service';
import { AuthService } from './auth.service';
import { StateData } from './interfaces/state-data.interface';
import { NestRedirection } from '@alekol/data';

/**
 * The maximum number of iterations to generate a state.
 * @constant
 * @default
 */
const MAX_ITERATIONS = 20;

/**
 * /auth
 */
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, private registrationService: RegistrationService) {}

	/**
	 * GET /register
	 * Redirects to the next service which needs the user's authorization.
	 * Creates a state parameter if needed.
	 * @param {string} state The state of the authentication process.
	 * @return {NestRedirection} The URL to the next service.
	 * @throws {BadRequestException} The state must exist in the database if provided.
	 * @throws {GatewayTimeoutException} The state cannot be a duplicate.
	 * @todo add the finale user to the database.
	 */
	@Get('register')
	@Redirect()
	register(@Query('state') state: string): NestRedirection {
		let data: StateData | null = null;
		if (state) {
			// fetch the state's associated data
			data = this.registrationService.fetchStateData(state);
			if (data === null) throw new BadRequestException();
			if (this.registrationService.hasAllFields(data)) {
				return { url: this.registrationService.getNextServiceURL(null) };
			}
		} else {
			// generates a new state
			// protect from timeouts with the MAX_ITERATIONS constant
			let i = 0;
			while (data === null) {
				if (i++ >= MAX_ITERATIONS) throw new GatewayTimeoutException();
				data = this.registrationService.setStateData(this.registrationService.initStateData());
			}
		}
		return { url: this.registrationService.getNextServiceURL(data) };
	}

	/**
	 * GET /42
	 * Authenticate the user with the authorization code and save his id and login.
	 * @param {string} code The 42's authorization code.
	 * @param {string} state The state of the authentication process.
	 * @return {Promise<NestRedirection>} The URL to the next service.
	 * @throws {BadRequestException} The state must exist in the database.
	 * @throws {InternalServerErrorException} 42 could not issue an access token using the code.
	 * @throws {InternalServerErrorException} 42 could not give information about the access token's owner.
	 * @todo possible security issue: prevent setting id or login again with a second request.
	 */
	@Get('42')
	@Redirect()
	async authWith42(@Query('code') code: string, @Query('state') state: string): Promise<NestRedirection> {
		let data: StateData = this.registrationService.fetchStateData(state);
		if (data === null) throw new BadRequestException('State is invalid');
		const auth = await this.authService.get42AccessToken(code);
		if (auth === null) throw new InternalServerErrorException('The code seems to be invalid...');
		const user = await this.authService.get42User(auth.access_token);
		if (user === null) throw new InternalServerErrorException('The access token seems to be invalid...');
		data = this.registrationService.updateStateData({ ...data, ft_id: user.id.toString(), ft_login: user.login })
		return { url: this.registrationService.getNextServiceURL(data) };
	}

	/**
	 * GET /discord
	 * Authenticate the user with the authorization code and save his id.
	 * @param {string} code The Discord's authorization code.
	 * @param {string} state The state of the authentication process.
	 * @return {Promise<NestRedirection>} The URL to the next service.
	 * @throws {BadRequestException} The state must exist in the database.
	 * @throws {InternalServerErrorException} Discord could not issue an access token using the code.
	 * @throws {InternalServerErrorException} Discord could not give information about the access token's owner.
	 * @todo possible security issue: prevent setting id again with a second request.
	 */
	@Get('discord')
	@Redirect()
	async authWithDiscord(@Query('code') code: string, @Query('state') state: string): Promise<NestRedirection> {
		let data: StateData = this.registrationService.fetchStateData(state);
		console.log(data);
		if (data === null) throw new BadRequestException('State is invalid');
		const auth = await this.authService.getDiscordAccessToken(code);
		if (auth === null) throw new InternalServerErrorException('The code seems to be invalid...');
		const user = await this.authService.getDiscordUser(auth.access_token);
		if (user === null) throw new InternalServerErrorException('The access token seems to be invalid...');
		data = this.registrationService.updateStateData({ ...data, discord_id: user.id.toString() });
		return { url: this.registrationService.getNextServiceURL(data) };
	}
}
