import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { RegistrationService } from '../registration/registration.service';

process.env.REDIRECT_URI = faker.internet.url();
process.env.DISCORD_CLIENT_ID = faker.random.numeric(18)
import configuration from '../conf/configuration';

const mock_state = faker.random.alphaNumeric(30);
const mock_access_token = faker.random.alphaNumeric(30);

const DISCORD_URL = configuration().discord.authorization_url;
const FE_URL = configuration().front_end.url;
const FT_URL = configuration().ft.authorization_url;

describe('AuthController', () => {
	let controller: AuthController;
	let registrationService: RegistrationService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [RegistrationService],
		}).compile();

		registrationService = module.get<RegistrationService>(RegistrationService);
		controller = module.get<AuthController>(AuthController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('register', () => {
		describe('when the state parameter is not provided', () => {
		})

		describe('when the state parameter is provided', () => {
			it('should fetch the state data', () => {
				const mock_state_data = {
					state: mock_state,
					access_token: {
						discord: null,
						ft: null,
					},
				};
				const spy = jest.spyOn(registrationService, 'fetchStateData')
					.mockImplementation(() => mock_state_data);
				controller.register(mock_state);
				expect(spy).toHaveBeenCalledWith(mock_state);
			});

			it("should redirect to discord", () => {
				const mock_state_data = {
					state: mock_state,
					access_token: {
						discord: null,
						ft: mock_access_token,
					},
				};
				jest.spyOn(registrationService, 'fetchStateData')
					.mockImplementation(() => mock_state_data);
				expect(controller.register(mock_state)).toStrictEqual({ url: DISCORD_URL(mock_state) });
			});

			it("should redirect to 42", () => {
				const mock_state_data = {
					state: mock_state,
					access_token: {
						discord: null,
						ft: null,
					},
				};
				jest.spyOn(registrationService, 'fetchStateData')
					.mockImplementation(() => mock_state_data);
				expect(controller.register(mock_state)).toStrictEqual({ url: FT_URL(mock_state) });
			});

			it("should redirect to the front end", () => {
				const mock_state_data = {
					state: mock_state,
					access_token: {
						discord: mock_access_token,
						ft: mock_access_token,
					},
				};
				jest.spyOn(registrationService, 'fetchStateData')
					.mockImplementation(() => mock_state_data);
				expect(controller.register(mock_state)).toStrictEqual({ url: FE_URL });
			});
		});
	});
});
