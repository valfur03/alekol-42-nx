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
		it('return the state\'s data', () => {
			expect(service.fetchStateData(mock_state)).toHaveProperty('state', mock_state);
		});

//		it('should fetch from the database', () => {
//			service.fetchStateData(mock_state);
//		})
	});
});
