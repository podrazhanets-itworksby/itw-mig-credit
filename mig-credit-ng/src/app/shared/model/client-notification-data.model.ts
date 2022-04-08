import { SexEnum } from 'src/app/shared/model/sex.enum';

export class ClientNotificationData {
	public sex: SexEnum;
	public name: string;
	public maskedPhone: string;

	public constructor(private data: any = {}) {
		this.sex = data.sex;
		this.name = data.name;
		this.maskedPhone = data.maskedPhone;
	}
}
