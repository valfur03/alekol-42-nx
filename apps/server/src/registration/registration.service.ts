import { Injectable } from '@nestjs/common';
import { StateData } from '../auth/interfaces/state-data.interface';

@Injectable()
export class RegistrationService {
	fetchStateData(state: string): StateData {
		const data: StateData = {
			state,
			access_token: {
				discord: null,
				ft: null,
			},
		};
		return data;
	}
}
