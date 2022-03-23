export class SessionData {
	public sessionId: string;
	public token: string;

	public constructor(private data: any = {}) {
		this.sessionId = data.sessionId;
		this.token = data.token;
	}
}
