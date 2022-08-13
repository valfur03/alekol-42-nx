import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationService } from './registration.service';
import { StateData } from '../auth/interfaces/state-data.interface';

const mock_state = faker.datatype.uuid();

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
	
	describe('fetchStateData(state)', () => {
		it('should return the state\'s data', () => {
			service.setStateData({
				state: mock_state,
				access_token: {
					discord: null,
					ft: null,
				},
			});
			const ret = service.fetchStateData(mock_state);
			expect(ret).toHaveProperty('state', mock_state);
			expect(ret).toHaveProperty('access_token', { discord: null, ft: null });
		});

		it('should return the state\'s data (with multiple entries)', () => {
			service.setStateData({
				state: mock_state + '0',
				access_token: {
					discord: null,
					ft: null,
				},
			});
			service.setStateData({
				state: mock_state,
				access_token: {
					discord: null,
					ft: null,
				},
			});
			service.setStateData({
				state: mock_state + '1',
				access_token: {
					discord: null,
					ft: null,
				},
			});
			const ret = service.fetchStateData(mock_state);
			expect(ret).toHaveProperty('state', mock_state);
			expect(ret).toHaveProperty('access_token', { discord: null, ft: null });
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
				access_token: {
					discord: null,
					ft: null,
				},
			});
			expect(ret).toHaveProperty('state', mock_state);
			expect(ret).toHaveProperty('access_token', { discord: null, ft: null });
		});

		it('should push the state\'s data', () => {
			service.setStateData({
				state: mock_state,
				access_token: {
					discord: null,
					ft: null,
				},
			});
			const ret = service.fetchStateData(mock_state);
			expect(ret).toHaveProperty('state', mock_state);
			expect(ret).toHaveProperty('access_token', { discord: null, ft: null });
		});

		it('should not duplicate entries', () => {
			service.setStateData({
				state: mock_state,
				access_token: {
					discord: null,
					ft: null,
				},
			});
			const ret = service.setStateData({
				state: mock_state,
				access_token: {
					discord: null,
					ft: null,
				},
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

		it('should initialize acces tokens to null', () => {
			const ret = service.initStateData();
			expect(ret).toHaveProperty('access_token')
			expect(ret.access_token).toHaveProperty('discord', null)
			expect(ret.access_token).toHaveProperty('ft', null)
		});
	})
});
