export class NewData {
	public sessionId: string;
	public fieldName: string;
	public fieldValue: string;

	public constructor(newData: any = {}) {
		this.sessionId = newData.sessionId;
		this.fieldName = newData.fieldName;
		this.fieldValue = newData.fieldValue;
	}
}
