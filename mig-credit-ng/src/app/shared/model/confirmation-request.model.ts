export class ConfirmationRequest {
	public text: string;

	public constructor(private data: any = {}) {
		this.text = data.text;
	}
}
