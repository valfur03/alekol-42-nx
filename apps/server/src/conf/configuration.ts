import { Logger } from '@nestjs/common';
import * as Joi from 'joi';

const schema = Joi.object({
	DISCORD_CLIENT_ID: Joi.string().required(),
	DISCORD_CLIENT_SECRET: Joi.string().required(),
	FRONT_END_URL: Joi.string().required(),
	FT_CLIENT_ID: Joi.string().required(),
	FT_CLIENT_SECRET: Joi.string().required(),
	REDIRECT_URI: Joi.string().required(),
}).unknown();

const { value, error } = schema.validate(process.env, {
	abortEarly: false,
});
if (error) {
	Logger.error(error);
	process.exit(1);
}

const {
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	FRONT_END_URL,
	FT_CLIENT_ID,
	FT_CLIENT_SECRET,
	REDIRECT_URI,
	POSTGRES_HOST,
	POSTGRES_PORT,
	POSTGRES_USER,
	POSTGRES_PASSWORD,
	POSTGRES_DB,
} = value;

enum DatabaseType {
	POSTGRES,
}

interface Config {
	redirect_uri: string,
	database: {
		type: DatabaseType,
		host: string,
		port: number,
		username: string,
		password: string,
		name: string,
	},
	discord: {
		authorization_url: (state?: string) => string,
		client_id: string,
		client_secret: string,
	},
	front_end: {
		url: string,
	},
	ft: {
		authorization_url: (state?: string) => string,
		client_id: string,
		client_secret: string,
	},
}

export default (): Config => ({
	redirect_uri: REDIRECT_URI,
	database: {
		type: DatabaseType.POSTGRES,
		host: POSTGRES_HOST,
		port: POSTGRES_PORT || 5432,
		username: POSTGRES_USER,
		password: POSTGRES_PASSWORD,
		name: POSTGRES_DB,
	},
	discord: {
		authorization_url: (state) => `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURI(REDIRECT_URI + '/discord')}&response_type=code&scope=identify${state ? `&state=${state}` : ''}`,
		client_id: DISCORD_CLIENT_ID,
		client_secret: DISCORD_CLIENT_SECRET,
	},
	front_end: {
		url: FRONT_END_URL,
	},
	ft: {
		authorization_url: (state) => `https://api.intra.42.fr/oauth/authorize?client_id=${FT_CLIENT_ID}&redirect_uri=${encodeURI(REDIRECT_URI + '/42')}&response_type=code${state ? `&state=${state}` : ''}`,
		client_id: FT_CLIENT_ID,
		client_secret: FT_CLIENT_SECRET,
	},
});
