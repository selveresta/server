export interface IServerConfig {
	port: number;
	logLevel: string;
	jwtSecret: string;
}

export interface ISqlConfig {
	dialect: Dialect;
	host: string;
	port: number;
	username: string;
	password: string;
	database: string;
	autoLoadEntities: boolean;
	synchronize: boolean;
}

export interface IConfig {
	sql: ISqlConfig;
	server: IServerConfig;
}
