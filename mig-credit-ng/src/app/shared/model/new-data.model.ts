export class NewData {
  public sessionId: string;
  public fieldName: string;
  public fieldValue: any;

  public constructor(private data: any = {}) {
    this.sessionId = data.sessionId;
    this.fieldName = data.fieldName;
    this.fieldValue = data.fieldValue;
  }
}
