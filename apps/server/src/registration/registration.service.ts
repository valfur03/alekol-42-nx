import { Injectable } from '@nestjs/common';
import { StateData, StateDataFields } from '../auth/interfaces/state-data.interface';
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
	/**
	 *	Returns whether the all the fields have been set.
	 *	@param {StateData} data The actual data related to a registration process.
	 *	@return {string} The URL.
	 */
	hasAllFields(data: StateData) : boolean {
		return SERVICES.every(service => service.fields.every(field => data[field] !== null));
	}

	/**
	 *	Get the URL of the next service to ask for an access token.
	 *	Returns the front-end's URL if no data are provided.
	 *	@param {StateData | null} data The actual data related to a registration process.
	 *	@return {string} The URL.
	 */
	getNextServiceURL(data: StateData | null): string {
		if (data === null) return configuration().front_end.url;
		const redirect = SERVICES.find(service => !service.fields.every(field => data[field] !== null));
		if (redirect !== undefined) return redirect.url(data.state);
		return configuration().redirect_uri + '/register?state=' + data.state;
	}
}
