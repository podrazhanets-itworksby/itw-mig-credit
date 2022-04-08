import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClientNotificationData } from 'src/app/shared/model/client-notification-data.model';
import { SessionService } from 'src/app/shared/services/session.service';
import { WebsocketService } from 'src/app/shared/services/websocket.service';

@Component({
	selector: 'mig-client',
	templateUrl: './client.component.html',
	styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit, OnDestroy {
	public sessionId: string;
	public showNotification: boolean;
	public clientNotificationData: ClientNotificationData;
	public notificationTimeout: any;

	public constructor(private sessionService: SessionService, private websocketService: WebsocketService) {
		this.showNotification = false;
		this.clientNotificationData = new ClientNotificationData();
	}

	public ngOnInit(): void {
		this.initializeListeners();
	}

	public ngOnDestroy(): void {
		clearTimeout(this.notificationTimeout);
	}

	public clientReadNotification(): void {
		this.showNotification = false;
		clearTimeout(this.notificationTimeout);
	}

	private initializeListeners(): void {
		this.sessionService.getSessionId().subscribe((value: string) => {
			this.sessionId = value;
			this.websocketService.connectClient(this.sessionId);
		});

		this.websocketService.subscribeToClientNotificationData().subscribe((data: ClientNotificationData) => {
			this.onClientNotificationDataReceived(data);
		});
	}

	private onClientNotificationDataReceived(data: ClientNotificationData): void {
		this.clientNotificationData = data;
		this.showNotification = true;
		this.websocketService.disconnect();
		this.notificationTimeout = setTimeout(() => {
			this.showNotification = false;
		}, 180000);
	}
}
