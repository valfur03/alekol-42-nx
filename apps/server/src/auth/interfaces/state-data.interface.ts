export interface StateData {
	state: string;
	ft_id: string | null;
	ft_login: string | null;
	discord_id: string | null;
	discord_guilds_id: string[];
}

export type StateDataFields = keyof StateData;
