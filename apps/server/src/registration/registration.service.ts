import { Injectable } from '@nestjs/common';
import { StateData } from '../auth/interfaces/state-data.interface';

@Injectable()
export class RegistrationService {
	private readonly states: StateData[] = [];

	/**
	 *	Fetch the data associated to a state.
	 *	@param {string} state The state to fetch.
	 *	@return {StateData | null} The data associated to a state, or null if it does not exist.
	 */
	fetchStateData(state: string): StateData | null {
		return this.states.find(data => data.state === state) || null;
	}

	/**
	 *	Set data associated to a state.
	 *	@param {StateData} data The data to set to a state.
	 *	@return {StateData | null} The inserted data, or null if it already exists.
	 */
	setStateData(data: StateData): StateData | null {
		if (this.fetchStateData(data.state) !== null) return null;
		this.states.push(data);
		return data;
	}
}
