import { EnvironmentModel } from 'src/environments/models/environment-model';

export const environment: EnvironmentModel = {
	production: true,
	host: '',
	webSocketEndPoint: 'wss',
	// videoCallEndpoint: 'https://194.58.98.76:21012',
	coturnUrl: '194.58.98.76',
	coturnUsername: 'itw-video-call',
	coturnPassword: '1m1t4teR',
};
