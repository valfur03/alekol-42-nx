import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { State as StateEntity } from '../states/state.entity';
import { StateData } from '../auth/interfaces/state-data.interface';
import * as crypto from "crypto";

@Injectable()
export class StatesService {
	private states: { [key: string]: StateData } = {};

	constructor(@InjectRepository(StateEntity)
				private stateRepository: Repository<StateEntity>) {}

	/**
	 *	Fetch the data associated to a state.
	 *	@param {string} state The state to fetch.
	 *	@return {StateData | null} The data associated to a state, or null if it does not exist.
	 */
	fetchStateData(state: string): Promise<StateEntity | null> {
		return this.stateRepository.findOneBy({ id: state });
	}

	/**
	 *	Set data associated to a state.
	 *	@param {StateData} data The data to set to a state.
	 *	@return {StateData | null} The inserted data, or null if it already exists.
	 */
	setStateData(data: StateData): StateData | null {
		if (this.fetchStateData(data.state) !== null) return null;
		this.states[data.state] = data;
		return data;
	}

	/**
	 *	Update data associated to a state.
	 *	@param {StateData} data The data to set to a state.
	 *	@return {StateData | null} The inserted data, or null if it already exists.
	 */
	updateStateData(data: StateData): StateData | null {
		let saved_data = this.fetchStateData(data.state)
		if (saved_data === null) return null;
		this.states[data.state] = data;
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
		delete this.states[state];
	}
}
