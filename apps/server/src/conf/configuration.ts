export default () => ({
	discord: {
		authorization_url: (state?: string) => `https://discord.com/api/oauth2/authorize?response_type=code&client_id=${process.env.DISCORD_CLIENT_ID}&scope=&redirect_uri=${process.env.REDIRECT_URI}${state ? `&state=${state}` : ''}`,
	},
	front_end: {
		url: process.env.FRONT_END_URL,
	},
	ft: {
		authorization_url: (state?: string) => `https://api.intra.42.fr/grant_type=client_credentials&client_id=${process.env.FT_CLIENT_ID}&client_secret=${process.env.FT_CLIENT_SECRET}${state ? `&state=${state}` : ''}`,
	},
});
