interface AccessTokenCollection {
	discord: string | null;
	ft: string | null;
}

export interface StateData {
	state: string;
	access_token: AccessTokenCollection;
}
