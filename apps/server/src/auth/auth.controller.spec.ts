import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegistrationService } from '../registration/registration.service';
import { StateData } from './interfaces/state-data.interface';
import { StatesService } from '../states/states.service';

process.env.REDIRECT_URI = faker.internet.url();
process.env.DISCORD_CLIENT_ID = faker.random.numeric(18)
import configuration from '../conf/configuration';
import {BadRequestException, GatewayTimeoutException, InternalServerErrorException} from '@nestjs/common';

const mock_state = faker.random.alphaNumeric(30);
const mock_ft_id: string = faker.random.numeric(5);
const mock_ft_login: string = faker.internet.userName();
const mock_discord_id: string = faker.random.numeric(18);
const mock_ft_auth: { access_token: string } = {
	access_token: faker.random.alphaNumeric(30),
};
const mock_discord_auth: { access_token: string } = {
	access_token: faker.random.alphaNumeric(30),
};
const mock_ft_user: { id: number, login: string } = {
	id: parseInt(mock_ft_id),
	login: mock_ft_login,
};
const mock_discord_user: { id: string } = {
	id: mock_discord_id,
};
const mock_code = faker.random.alphaNumeric(30);
const mock_ft_redirection_url: string = faker.internet.url();
const mock_discord_redirection_url: string = faker.internet.url();
const mock_front_end_url: string = faker.internet.url();

const DISCORD_URL = configuration().discord.authorization_url;
const FE_URL = configuration().front_end.url;
const FT_URL = configuration().ft.authorization_url;

describe('AuthController', () => {
	let controller: AuthController;
	let authService: AuthService;
	let registrationService: RegistrationService;
	let statesService: StatesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [AuthService, RegistrationService, StatesService],
		}).compile();

		statesService = module.get<StatesService>(StatesService);
		registrationService = module.get<RegistrationService>(RegistrationService);
		authService = module.get<AuthService>(AuthService);
		controller = module.get<AuthController>(AuthController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('register', () => {
		describe('when the state parameter is not provided', () => {
			it('should create the data using the initStateData method', () => {
				const mock_state_data: StateData = {
					state: mock_state,
					ft_id: null,
					ft_login: null,
					discord_id: null,
					discord_guilds_id: [],
				};
				jest.spyOn(statesService, 'initStateData')
					.mockImplementation(() => mock_state_data);
				const spy = jest.spyOn(statesService, 'setStateData')
					.mockImplementation(() => mock_state_data);
				controller.register(undefined);
				expect(spy).toHaveBeenCalledWith(mock_state_data);
			});

			it('should try until the state it eventually unique', () => {
				const mock_state_data: StateData = {
					state: mock_state,
					ft_id: null,
					ft_login: null,
					discord_id: null,
					discord_guilds_id: [],
				};
				jest.spyOn(statesService, 'initStateData')
					.mockImplementation(() => mock_state_data);
				const spy = jest.spyOn(statesService, 'setStateData')
					.mockImplementation(() => mock_state_data)
					.mockImplementationOnce(() => null);
				controller.register(undefined);
				expect(spy).toHaveBeenCalledTimes(2);
			});

			it('should not iterate more than n times', () => {
				const mock_state_data: StateData = {
					state: mock_state,
					ft_id: null,
					ft_login: null,
					discord_id: null,
					discord_guilds_id: [],
				};
				jest.spyOn(statesService, 'initStateData')
					.mockImplementation(() => mock_state_data);
				const spy = jest.spyOn(statesService, 'setStateData')
					.mockImplementation(() => null);
				expect(() => controller.register(undefined)).toThrow(GatewayTimeoutException);
				expect(spy).toHaveBeenCalledTimes(20);
			});
		})

		describe('when the state parameter is provided', () => {
			it('should fetch the state data', () => {
				const mock_state_data: StateData = {
					state: mock_state,
					ft_id: null,
					ft_login: null,
					discord_id: null,
					discord_guilds_id: [],
				};
				const spy = jest.spyOn(statesService, 'fetchStateData')
					.mockImplementation(() => mock_state_data);
				controller.register(mock_state);
				expect(spy).toHaveBeenCalledWith(mock_state);
			});

			it('should call the hasAllFields function', async () => {
				let mock_state_data: StateData = {
					state: mock_state,
					ft_id: null,
					ft_login: null,
					discord_id: null,
					discord_guilds_id: [],
				};
				jest.spyOn(statesService, 'fetchStateData')
					.mockImplementation(() => mock_state_data);
				const spy = jest.spyOn(registrationService, 'hasAllFields')
					.mockImplementation(() => false);
				controller.register(mock_state);
				expect(spy).toHaveBeenCalledWith(mock_state_data);
			});

			it('should call the getNextServiceURL function', async () => {
				let mock_state_data: StateData = {
					state: mock_state,
					ft_id: null,
					ft_login: null,
					discord_id: null,
					discord_guilds_id: [],
				};
				jest.spyOn(statesService, 'fetchStateData')
					.mockImplementation(() => mock_state_data);
				jest.spyOn(registrationService, 'hasAllFields')
					.mockImplementation(() => false);
				const spy = jest.spyOn(registrationService, 'getNextServiceURL')
					.mockImplementation(() => mock_ft_redirection_url);
				const ret = controller.register(mock_state);
				expect(spy).toHaveBeenCalledWith(mock_state_data);
				expect(ret).toStrictEqual({ url: mock_ft_redirection_url });
			});
		});

		describe('when all fields are provided', () => {
			it('should redirect to front-end', async () => {
				let mock_state_data: StateData = {
					state: mock_state,
					ft_id: mock_ft_id,
					ft_login: mock_ft_login,
					discord_id: mock_discord_id,
					discord_guilds_id: [],
				};
				jest.spyOn(statesService, 'fetchStateData')
					.mockImplementation(() => mock_state_data);
				jest.spyOn(registrationService, 'hasAllFields')
					.mockImplementation(() => true);
				jest.spyOn(registrationService, 'getNextServiceURL')
					.mockImplementation(() => mock_front_end_url);
				const ret = controller.register(mock_state);
				expect(ret).toStrictEqual({ url: mock_front_end_url });
			});
		});

		describe('when the state parameter is invalid', () => {
			it('should throw BadRequestException', () => {
				jest.spyOn(statesService, 'fetchStateData')
					.mockImplementation(() => null);
				expect(() => controller.register(mock_state)).toThrow(BadRequestException);
			});
		});
	});

	describe('authWith42', () => {
		describe('when everything is ok', () => {
			it('should set the new state data', async () => {
				let mock_state_data: StateData = {
					state: mock_state,
					ft_id: null,
					ft_login: null,
					discord_id: null,
					discord_guilds_id: [],
				};
				jest.spyOn(statesService, 'fetchStateData')
					.mockImplementation(() => mock_state_data);
				jest.spyOn(authService, 'get42AccessToken')
					.mockImplementation(() => Promise.resolve(mock_ft_auth));
				jest.spyOn(authService, 'get42User')
					.mockImplementation(() => Promise.resolve(mock_ft_user));
				mock_state_data.ft_id = mock_ft_id;
				mock_state_data.ft_login = mock_ft_login;
				const spy = jest.spyOn(statesService, 'updateStateData')
					.mockImplementation(() => mock_state_data);
				await controller.authWith42(mock_code, mock_state);
				expect(spy).toHaveBeenCalledWith(mock_state_data);
			});

			it('should call the getNextServiceURL function', async () => {
				let mock_state_data: StateData = {
					state: mock_state,
					ft_id: null,
					ft_login: null,
					discord_id: null,
					discord_guilds_id: [],
				};
				jest.spyOn(statesService, 'fetchStateData')
					.mockImplementation(() => mock_state_data);
				jest.spyOn(authService, 'get42AccessToken')
					.mockImplementation(() => Promise.resolve(mock_ft_auth));
				jest.spyOn(authService, 'get42User')
					.mockImplementation(() => Promise.resolve(mock_ft_user));
				mock_state_data.ft_id = mock_ft_id;
				mock_state_data.ft_login = mock_ft_login;
				jest.spyOn(statesService, 'setStateData')
					.mockImplementation(() => mock_state_data);
				const spy = jest.spyOn(registrationService, 'getNextServiceURL')
					.mockImplementation(() => mock_ft_redirection_url);
				const ret = await controller.authWith42(mock_code, mock_state);
				expect(spy).toHaveBeenCalledWith(mock_state_data);
				expect(ret).toStrictEqual({ url: mock_ft_redirection_url });
			});
		});

		describe('when the state parameter is invalid', () => {
			it('should throw BadRequestException', async () => {
				jest.spyOn(statesService, 'fetchStateData')
					.mockImplementation(() => null);
				await expect(() => controller.authWith42(mock_code, mock_state)).rejects.toThrow(new BadRequestException('State is invalid'));
			});
		});

		describe('when the access token request fails', () => {
			it('should throw InternalServerErrorException', async () => {
				const mock_state_data: StateData = {
					state: mock_state,
					ft_id: null,
					ft_login: null,
					discord_id: null,
					discord_guilds_id: [],
				};
				jest.spyOn(statesService, 'fetchStateData')
					.mockImplementation(() => mock_state_data);
				jest.spyOn(authService, 'get42AccessToken')
					.mockImplementation(() => Promise.resolve(null));
				await expect(() => controller.authWith42(mock_code, mock_state)).rejects.toThrow(new InternalServerErrorException('The code seems to be invalid...'));
			});
		});

		describe('when the user\'s data request fails', () => {
			it('should throw InternalServerErrorException', async () => {
				const mock_state_data: StateData = {
					state: mock_state,
					ft_id: null,
					ft_login: null,
					discord_id: null,
					discord_guilds_id: [],
				};
				jest.spyOn(statesService, 'fetchStateData')
					.mockImplementation(() => mock_state_data);
				jest.spyOn(authService, 'get42AccessToken')
					.mockImplementation(() => Promise.resolve(mock_ft_auth));
				jest.spyOn(authService, 'get42User')
					.mockImplementation(() => Promise.resolve(null));
				await expect(() => controller.authWith42(mock_code, mock_state)).rejects.toThrow(new InternalServerErrorException('The access token seems to be invalid...'));
			});
		});
	});

	describe('authWithDiscord', () => {
		describe('when everything is ok', () => {
			it('should set the new state data', async () => {
				let mock_state_data: StateData = {
					state: mock_state,
					ft_id: null,
					ft_login: null,
					discord_id: null,
					discord_guilds_id: [],
				};
				jest.spyOn(statesService, 'fetchStateData')
					.mockImplementation(() => mock_state_data);
				jest.spyOn(authService, 'getDiscordAccessToken')
					.mockImplementation(() => Promise.resolve(mock_discord_auth));
				jest.spyOn(authService, 'getDiscordUser')
					.mockImplementation(() => Promise.resolve(mock_discord_user));
				mock_state_data.discord_id = mock_discord_id;
				const spy = jest.spyOn(statesService, 'updateStateData')
					.mockImplementation(() => mock_state_data);
				await controller.authWithDiscord(mock_code, mock_state);
				expect(spy).toHaveBeenCalledWith(mock_state_data);
			});

			it('should call the getNextServiceURL function', async () => {
				let mock_state_data: StateData = {
					state: mock_state,
					ft_id: null,
					ft_login: null,
					discord_id: null,
					discord_guilds_id: [],
				};
				jest.spyOn(statesService, 'fetchStateData')
					.mockImplementation(() => mock_state_data);
				jest.spyOn(authService, 'getDiscordAccessToken')
					.mockImplementation(() => Promise.resolve(mock_discord_auth));
				jest.spyOn(authService, 'getDiscordUser')
					.mockImplementation(() => Promise.resolve(mock_discord_user));
				mock_state_data.discord_id = mock_discord_id;
				jest.spyOn(statesService, 'setStateData')
					.mockImplementation(() => mock_state_data);
				const spy = jest.spyOn(registrationService, 'getNextServiceURL')
					.mockImplementation(() => mock_discord_redirection_url);
				const ret = await controller.authWithDiscord(mock_code, mock_state);
				expect(spy).toHaveBeenCalledWith(mock_state_data);
				expect(ret).toStrictEqual({ url: mock_discord_redirection_url });
			});
		});

		describe('when the state parameter is invalid', () => {
			it('should throw BadRequestException', async () => {
				jest.spyOn(statesService, 'fetchStateData')
					.mockImplementation(() => null);
				await expect(() => controller.authWithDiscord(mock_code, mock_state)).rejects.toThrow(new BadRequestException('State is invalid'));
			});
		});

		describe('when the access token request fails', () => {
			it('should throw InternalServerErrorException', async () => {
				const mock_state_data: StateData = {
					state: mock_state,
					ft_id: null,
					ft_login: null,
					discord_id: null,
					discord_guilds_id: [],
				};
				jest.spyOn(statesService, 'fetchStateData')
					.mockImplementation(() => mock_state_data);
				jest.spyOn(authService, 'getDiscordAccessToken')
					.mockImplementation(() => Promise.resolve(null));
				await expect(() => controller.authWithDiscord(mock_code, mock_state)).rejects.toThrow(new InternalServerErrorException('The code seems to be invalid...'));
			});
		});

		describe('when the user\'s data request fails', () => {
			it('should throw InternalServerErrorException', async () => {
				const mock_state_data: StateData = {
					state: mock_state,
					ft_id: null,
					ft_login: null,
					discord_id: null,
					discord_guilds_id: [],
				};
				jest.spyOn(statesService, 'fetchStateData')
					.mockImplementation(() => mock_state_data);
				jest.spyOn(authService, 'getDiscordAccessToken')
					.mockImplementation(() => Promise.resolve(mock_discord_auth));
				jest.spyOn(authService, 'getDiscordUser')
					.mockImplementation(() => Promise.resolve(null));
				await expect(() => controller.authWithDiscord(mock_code, mock_state)).rejects.toThrow(new InternalServerErrorException('The access token seems to be invalid...'));
			});
		});
	});
});
