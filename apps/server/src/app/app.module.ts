import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { State } from '../states/state.entity';
import configuration from '../conf/configuration';

@Module({
	imports: [AuthModule, TypeOrmModule.forRoot({
		type: 'postgres',
		host: configuration().database.host,
		port: configuration().database.port,
		username: configuration().database.username,
		password: configuration().database.password,
		database: configuration().database.name,
		entities: [State],
		synchronize: true,
	})],
})
export class AppModule {}
