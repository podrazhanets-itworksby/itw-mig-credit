import { EnvironmentModel } from 'src/environments/models/environment-model';

export const environment: EnvironmentModel = {
	production: true,
	host: '',
	webSocketEndPoint: 'wss',
	videoCallEndpoint: 'https://192.168.0.220:18181',
};
