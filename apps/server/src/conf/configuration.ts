const {
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	FRONT_END_URL,
	FT_CLIENT_ID,
	FT_CLIENT_SECRET,
	REDIRECT_URI
} = process.env;

export default () => ({
	redirect_uri: REDIRECT_URI,
	discord: {
		authorization_url: (state?: string) => `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURI(REDIRECT_URI + '/discord')}&response_type=code&scope=identify${state ? `&state=${state}` : ''}`,
		client_id: DISCORD_CLIENT_ID,
		client_secret: DISCORD_CLIENT_SECRET,
	},
	front_end: {
		url: FRONT_END_URL,
	},
	ft: {
		authorization_url: (state?: string) => `https://api.intra.42.fr/oauth/authorize?client_id=${FT_CLIENT_ID}&redirect_uri=${encodeURI(REDIRECT_URI + '/42')}&response_type=code${state ? `&state=${state}` : ''}`,
		client_id: FT_CLIENT_ID,
		client_secret: FT_CLIENT_SECRET,
	},
});
