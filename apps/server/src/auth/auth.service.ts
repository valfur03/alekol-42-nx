import { Injectable } from '@nestjs/common';
import configuration from '../conf/configuration';

interface AuthorizationCodeGrantFlowData {
	client_id: string;
	client_secret: string;
	code: string;
	redirect_uri: string ;
}

interface FtUser {
	id: number;
	login: string;
}

interface DiscordUser {
	id: string;
}

@Injectable()
export class AuthService {
	private async authorizationCodeGrant(url: string, { client_id, client_secret, code, redirect_uri }: AuthorizationCodeGrantFlowData) {
		const body = new FormData();
		body.append('grant_type', 'authorization_code');
		body.append('client_id', client_id);
		body.append('client_secret', client_secret);
		body.append('code', code);
		body.append('redirect_uri', redirect_uri);
		return fetch(url, {
			method: 'POST',
			body,
		})
			.then(async (response) => {
				if (!response.ok) throw await response.json();
				return response.json();
			})
			.catch((error) => {
				console.error(error);
				return null;
			});
	}

	async get42AccessToken(code: string) {
		return this.authorizationCodeGrant('https://api.intra.42.fr/oauth/token', {
			client_id: configuration().ft.client_id,
			client_secret: configuration().ft.client_secret,
			code,
			redirect_uri: configuration().redirect_uri + '/42',
		});
	}

	async get42User(access_token: string): Promise<FtUser> {
		return fetch('https://api.intra.42.fr/v2/me', {
			headers: {
				Authorization: 'Bearer ' + access_token,
			},
		})
			.then((response) => {
				if (!response.ok) return null;
				return response.json();
			})
			.catch(console.error);
	}

	async getDiscordAccessToken(code: string) {
		return this.authorizationCodeGrant('https://discord.com/api/v10/oauth2/token', {
			client_id: configuration().discord.client_id,
			client_secret: configuration().discord.client_secret,
			code,
			redirect_uri: configuration().redirect_uri + '/discord',
		});
	}

	async getDiscordUser(access_token: string): Promise<DiscordUser> {
		return fetch('https://discord.com/api/users/@me', {
			headers: {
				Authorization: 'Bearer ' + access_token,
			},
		})
			.then((response) => {
				if (!response.ok) return null;
				return response.json();
			})
			.catch(console.error);
	}
}
