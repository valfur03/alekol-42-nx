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
				expect(ret).toBe(configuration().redirect_uri + '/register');
			});
		});
	});

	describe('fetchStateData(state)', () => {
		it('should return the state\'s data', () => {
			service.setStateData({
				state: mock_state,
				ft_id: mock_ft_id,
				ft_login: mock_ft_login,
				discord_id: mock_discord_id,
				discord_guilds_id: mock_discord_guilds_id,
			});
			const ret = service.fetchStateData(mock_state);
			expect(ret).toHaveProperty('state', mock_state);
			expect(ret).toHaveProperty('ft_id', mock_ft_id);
			expect(ret).toHaveProperty('ft_login', mock_ft_login);
			expect(ret).toHaveProperty('discord_id', mock_discord_id);
			expect(ret).toHaveProperty('discord_guilds_id', mock_discord_guilds_id);
		});

		it('should return the state\'s data (with multiple entries)', () => {
			service.setStateData({
				state: mock_state + '0',
				ft_id: mock_ft_id,
				ft_login: mock_ft_login,
				discord_id: mock_discord_id,
				discord_guilds_id: mock_discord_guilds_id,
			});
			service.setStateData({
				state: mock_state,
				ft_id: mock_ft_id,
				ft_login: mock_ft_login,
				discord_id: mock_discord_id,
				discord_guilds_id: mock_discord_guilds_id,
			});
			service.setStateData({
				state: mock_state + '1',
				ft_id: mock_ft_id,
				ft_login: mock_ft_login,
				discord_id: mock_discord_id,
				discord_guilds_id: mock_discord_guilds_id,
			});
			const ret = service.fetchStateData(mock_state);
			expect(ret).toHaveProperty('state', mock_state);
			expect(ret).toHaveProperty('ft_id', mock_ft_id);
			expect(ret).toHaveProperty('ft_login', mock_ft_login);
			expect(ret).toHaveProperty('discord_id', mock_discord_id);
			expect(ret).toHaveProperty('discord_guilds_id', mock_discord_guilds_id);
		});

		it('should return null', () => {
			expect(service.fetchStateData(mock_state)).toBeNull();
		});

//		it('should fetch from the database', () => {
//			service.fetchStateData(mock_state);
//		})
	});
	
	describe('setStateData(state)', () => {
		it('should return the state\'s data', () => {
			const ret = service.setStateData({
				state: mock_state,
				ft_id: mock_ft_id,
				ft_login: mock_ft_login,
				discord_id: mock_discord_id,
				discord_guilds_id: mock_discord_guilds_id,
			});
			expect(ret).toHaveProperty('state', mock_state);
			expect(ret).toHaveProperty('ft_id', mock_ft_id);
			expect(ret).toHaveProperty('ft_login', mock_ft_login);
			expect(ret).toHaveProperty('discord_id', mock_discord_id);
			expect(ret).toHaveProperty('discord_guilds_id', mock_discord_guilds_id);
		});

		it('should push the state\'s data', () => {
			service.setStateData({
				state: mock_state,
				ft_id: mock_ft_id,
				ft_login: mock_ft_login,
				discord_id: mock_discord_id,
				discord_guilds_id: mock_discord_guilds_id,
			});
			const ret = service.fetchStateData(mock_state);
			expect(ret).toHaveProperty('state', mock_state);
			expect(ret).toHaveProperty('ft_id', mock_ft_id);
			expect(ret).toHaveProperty('ft_login', mock_ft_login);
			expect(ret).toHaveProperty('discord_id', mock_discord_id);
			expect(ret).toHaveProperty('discord_guilds_id', mock_discord_guilds_id);
		});

		it('should not duplicate entries', () => {
			service.setStateData({
				state: mock_state,
				ft_id: null,
				ft_login: null,
				discord_id: null,
				discord_guilds_id: [],
			});
			const ret = service.setStateData({
				state: mock_state,
				ft_id: null,
				ft_login: null,
				discord_id: null,
				discord_guilds_id: [],
			});
			expect(ret).toBeNull();
		});
	});

	describe('initStateData', () => {
		it('should generate an unique state', () => {
			const ret1 = service.initStateData();
			const ret2 = service.initStateData();
			expect(ret1.state).not.toBe(ret2.state);
		});

		it('should initialize data to null', () => {
			const ret = service.initStateData();
			expect(ret).toHaveProperty('ft_id', null);
			expect(ret).toHaveProperty('ft_login', null);
			expect(ret).toHaveProperty('discord_id', null);
			expect(ret).toHaveProperty('discord_guilds_id', []);
		});
	})

	describe('deleteStateData', () => {
		it('should delete only the state\'s data', () => {
			service.setStateData({
				state: mock_state + '0',
				ft_id: null,
				ft_login: null,
				discord_id: null,
				discord_guilds_id: [],
			});
			service.setStateData({
				state: mock_state,
				ft_id: null,
				ft_login: null,
				discord_id: null,
				discord_guilds_id: [],
			});
			service.setStateData({
				state: mock_state + '1',
				ft_id: null,
				ft_login: null,
				discord_id: null,
				discord_guilds_id: [],
			});
			service.deleteStateData(mock_state);
			expect(service.fetchStateData(mock_state + '0')).not.toBeNull();
			expect(service.fetchStateData(mock_state + '1')).not.toBeNull();
		});
	});
});
