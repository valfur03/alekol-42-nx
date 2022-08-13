import { Injectable } from '@nestjs/common';
import { StateData } from '../auth/interfaces/state-data.interface';
import * as crypto from "crypto";

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

	/**
	 *  Initialize data associated to a generated state.
	 *  @return {StateData} The newly created data.
	 */
	initStateData(): StateData {
		const data: StateData = {
			state: crypto.randomBytes(16).toString("hex"),
			access_token: {
				discord: null,
				ft: null,
			}
		};
		return data;
	}
}
