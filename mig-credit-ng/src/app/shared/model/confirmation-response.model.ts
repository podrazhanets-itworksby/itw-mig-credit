export class ConfirmationResponse {
	public sessionId: string;
	public isConfirmed: boolean;

	public constructor(private data: any = {}) {
		this.sessionId = data.sessionId;
		this.isConfirmed = data.isConfirmed;
	}
}
