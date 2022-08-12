import { faker } from '@faker-js/faker';

process.env.DISCORD_CLIENT_ID = faker.random.numeric(18);
process.env.FT_CLIENT_ID = faker.random.numeric(18);
process.env.FT_CLIENT_SECRET = faker.random.numeric(18);
import configuration from "./configuration";

const mock_state = faker.random.alphaNumeric(30);

describe('discord', () => {
	describe('authorization_url', () => {
		it('should be a Discord URL', () => {
			expect(configuration().discord.authorization_url()).toContain('https://discord.com/');
		});

		it('should contain the client ID', () => {
			expect(configuration().discord.authorization_url()).toContain(`client_id=${process.env.DISCORD_CLIENT_ID}`);
		});

		it('should contain the state', () => {
			expect(configuration().discord.authorization_url(mock_state)).toContain(`state=${mock_state}`);
		});

		it('should not contain the state', () => {
			expect(configuration().discord.authorization_url()).not.toContain('state');
		});
	});
});

describe('42', () => {
	describe('authorization_url', () => {
		it('should be a 42 URL', () => {
			expect(configuration().ft.authorization_url()).toContain('https://api.intra.42.fr/');
		});

		it('should contain the client ID', () => {
			expect(configuration().ft.authorization_url()).toContain(`client_id=${process.env.FT_CLIENT_ID}`);
		});

		it('should contain the client secret', () => {
			expect(configuration().ft.authorization_url()).toContain(`client_secret=${process.env.FT_CLIENT_SECRET}`);
		});

		it('should contain the state', () => {
			expect(configuration().ft.authorization_url(mock_state)).toContain(`state=${mock_state}`);
		});

		it('should not contain the state', () => {
			expect(configuration().ft.authorization_url()).not.toContain('state');
		});
	});
});
