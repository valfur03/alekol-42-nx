import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class State {
	@PrimaryColumn()
	id: string;

	@Column()
	ft_id: string;

	@Column()
	ft_login: string;

	@Column()
	discord_id: string;
}
