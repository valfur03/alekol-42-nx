import { Injectable } from '@nestjs/common';
import { StateData, StateDataFields } from '../auth/interfaces/state-data.interface';
import * as crypto from "crypto";

import configuration from '../conf/configuration';

const SERVICES: { name: string, fields: StateDataFields[], url: (state: string) => string }[] = [
	{
		name: '42',
		fields: ['ft_id', 'ft_login'],
		url: configuration().ft.authorization_url,
	},
	{
		name: 'Discord',
		fields: ['discord_id'],
		url: configuration().discord.authorization_url,
	},
];

@Injectable()
export class RegistrationService {
	private states: StateData[] = [];

	/**
	 *	Get the URL of the next service to ask for an access token.
	 *	@param {StateData} data The actual data related to a registration process.
	 *	@return {string} The URL.
	 */
	getNextServiceURL(data: StateData): string {
		const redirect = SERVICES.find(service => !service.fields.every(field => data[field] !== null));
		if (redirect !== undefined) return redirect.url(data.state);
		return configuration().redirect_uri + '/register';
	}

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
			ft_id: null,
			ft_login: null,
			discord_id: null,
			discord_guilds_id: [],
		};
		return data;
	}

	/**
	 *  Delete the data associated to a generated state.
	 *	@param {string} state The state to delete.
	 */
	deleteStateData(state: string) {
		this.states = this.states.filter(data => data.state != state);
	}
}
