import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationService } from './registration.service';

const mock_state = faker.datatype.uuid();
const mock_ft_id: string = faker.random.numeric(5);
const mock_ft_login: string = faker.internet.userName();
const mock_discord_id: string = faker.random.numeric(18);
const mock_discord_guilds_id: string[] = [
	faker.random.numeric(18),
	faker.random.numeric(18),
	faker.random.numeric(18),
];

process.env.REDIRECT_URI = faker.internet.url();
process.env.DISCORD_CLIENT_ID = faker.random.numeric(18);
process.env.DISCORD_CLIENT_SECRET = faker.random.numeric(18);
process.env.FRONT_END_URL = faker.internet.url();
process.env.FT_CLIENT_ID = faker.random.numeric(30);
process.env.FT_CLIENT_SECRET = faker.random.numeric(30);
process.env.REDIRECT_URI = faker.internet.url();
import configuration from '../conf/configuration';

describe('RegistrationService', () => {
	let service: RegistrationService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [RegistrationService],
		}).compile();

		service = module.get<RegistrationService>(RegistrationService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('hasAllFields(data)', () => {
		describe('when ft_id is null', () => {
			it('should return false', () => {
				const mock_state_data = {
					state: mock_state,
					ft_id: null,
					ft_login: mock_ft_login,
					discord_id: mock_discord_id,
					discord_guilds_id: mock_discord_guilds_id,
				};
				const ret = service.hasAllFields(mock_state_data);
				expect(ret).toBe(false);
			});
		});

		describe('when ft_login is null', () => {
			it('should return false', () => {
				const mock_state_data = {
					state: mock_state,
					ft_id: mock_ft_id,
					ft_login: null,
					discord_id: mock_discord_id,
					discord_guilds_id: mock_discord_guilds_id,
				};
				const ret = service.hasAllFields(mock_state_data);
				expect(ret).toBe(false);
			});
		});

		describe('when discord_id is null', () => {
			it('should return false', () => {
				const mock_state_data = {
					state: mock_state,
					ft_id: mock_ft_id,
					ft_login: null,
					discord_id: mock_discord_id,
					discord_guilds_id: mock_discord_guilds_id,
				};
				const ret = service.hasAllFields(mock_state_data);
				expect(ret).toBe(false);
			});
		});

		describe('when everything is set', () => {
			it('should return true', () => {
				const mock_state_data = {
					state: mock_state,
					ft_id: mock_ft_id,
					ft_login: mock_ft_login,
					discord_id: mock_discord_id,
					discord_guilds_id: mock_discord_guilds_id,
				};
				const ret = service.hasAllFields(mock_state_data);
				expect(ret).toBe(true);
			});
		});
	});

	describe('getNextServiceURL(data)', () => {
		describe('when only the ft_id is null', () => {
			it('should redirect to 42', () => {
				const mock_state_data = {
					state: mock_state,
					ft_id: null,
					ft_login: mock_ft_login,
					discord_id: mock_discord_id,
					discord_guilds_id: mock_discord_guilds_id,
				};
				const ret = service.getNextServiceURL(mock_state_data);
				expect(ret).toBe(configuration().ft.authorization_url(mock_state));
			});
		});

		describe('when only the ft_login is null', () => {
			it('should redirect to 42', () => {
				const mock_state_data = {
					state: mock_state,
					ft_id: mock_ft_id,
					ft_login: null,
					discord_id: mock_discord_id,
					discord_guilds_id: mock_discord_guilds_id,
				};
				const ret = service.getNextServiceURL(mock_state_data);
				expect(ret).toBe(configuration().ft.authorization_url(mock_state));
			});
		});

		describe('when only the discord_id is null', () => {
			it('should redirect to Discord', () => {
				const mock_state_data = {
					state: mock_state,
					ft_id: mock_ft_id,
					ft_login: mock_ft_login,
					discord_id: null,
					discord_guilds_id: mock_discord_guilds_id,
				};
				const ret = service.getNextServiceURL(mock_state_data);
				expect(ret).toBe(configuration().discord.authorization_url(mock_state));
			});
		});

		describe('when all fields are set', () => {
			it('should redirect to front-end', () => {
				const mock_state_data = {
					state: mock_state,
					ft_id: mock_ft_id,
					ft_login: mock_ft_login,
					discord_id: mock_discord_id,
					discord_guilds_id: mock_discord_guilds_id,
				};
				const ret = service.getNextServiceURL(mock_state_data);
				expect(ret).toBe(configuration().redirect_uri + '/register?state=' + mock_state);
			});
		});
	});
});
