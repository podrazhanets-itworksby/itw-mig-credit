import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ClientNotificationData } from 'src/app/shared/model/client-notification-data.model';
import { SexEnum } from 'src/app/shared/model/sex.enum';

@Component({
	selector: 'mig-client-notification',
	templateUrl: './client-notification.component.html',
	styleUrls: ['./client-notification.component.scss'],
})
export class ClientNotificationComponent {
	@Input() public data: ClientNotificationData;
	@Output() public read: EventEmitter<void>;

	public sex: typeof SexEnum;

	public constructor() {
		this.data = new ClientNotificationData();
		this.sex = SexEnum;
		this.read = new EventEmitter();
	}

	public ok(): void {
		this.read.emit();
	}
}
