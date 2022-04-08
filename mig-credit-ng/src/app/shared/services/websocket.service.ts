import { Injectable } from '@angular/core';
import { CompatClient, IMessage, Stomp } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { ClientNotificationData } from 'src/app/shared/model/client-notification-data.model';
import { ConfirmationRequest } from 'src/app/shared/model/confirmation-request.model';
import { ConfirmationResponse } from 'src/app/shared/model/confirmation-response.model';
import { NewData } from 'src/app/shared/model/new-data.model';
import { SessionId } from 'src/app/shared/model/session-id.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
	private webSocketEndPoint: string;
	private stompClient: CompatClient;
	private newDataSubject: Subject<NewData>;
	private confirmationRequestSubject: Subject<ConfirmationRequest>;
	private confirmationResponseSubject: Subject<ConfirmationResponse>;
	private clientNotificationDataSubject: Subject<ClientNotificationData>;

	public constructor() {
		this.webSocketEndPoint = environment.webSocketEndPoint;
		this.newDataSubject = new Subject();
		this.confirmationRequestSubject = new Subject();
		this.confirmationResponseSubject = new Subject();
		this.clientNotificationDataSubject = new Subject();
	}

	public connect(): void {
		let ws = new SockJS(this.webSocketEndPoint);
		this.stompClient = Stomp.over(ws);
	}

	public sendNewData(data: NewData): void {
		this.stompClient.send('/app/new-data', {}, JSON.stringify(data));
	}

	public sendConfirmationRequest(data: SessionId): void {
		this.stompClient.send('/app/confirmation-request', {}, JSON.stringify(data));
	}

	public sendConfirmationResponse(data: ConfirmationResponse): void {
		this.stompClient.send('/app/confirmation-response', {}, JSON.stringify(data));
	}

	public connectOperator(sessionId: string): void {
		if (!sessionId) {
			return;
		}
		this.connect();
		this.stompClient.connect(
			{},
			() => {
				this.stompClient.subscribe('/confirmation-response/output/' + sessionId, (message) => {
					this.confirmationResponseSubject.next(new ConfirmationResponse(JSON.parse(message.body)));
				});
			},
			this.errorCallBack
		);
	}

	public connectClient(sessionId: string): void {
		if (!sessionId) {
			return;
		}
		this.connect();
		this.stompClient.connect(
			{},
			() => {
				this.stompClient.subscribe('/new-data/output/' + sessionId, (message) => {
					this.newDataSubject.next(new NewData(JSON.parse(message.body)));
				});

				this.stompClient.subscribe('/confirmation-request/output/' + sessionId, (message) => {
					this.confirmationRequestSubject.next(new ConfirmationRequest(JSON.parse(message.body)));
				});

				this.stompClient.subscribe('/client-notification/output/' + sessionId, (message) => {
					this.clientNotificationDataSubject.next(new ClientNotificationData(JSON.parse(message.body)));
				});
			},
			this.errorCallBack
		);
	}

	public subscribeToNewData(): Observable<NewData> {
		return this.newDataSubject.asObservable();
	}

	public subscribeToConfirmationRequest(): Observable<ConfirmationRequest> {
		return this.confirmationRequestSubject.asObservable();
	}

	public subscribeToConfirmationResponse(): Observable<ConfirmationResponse> {
		return this.confirmationResponseSubject.asObservable();
	}

	public subscribeToClientNotificationData(): Observable<ClientNotificationData> {
		return this.clientNotificationDataSubject.asObservable();
	}

	public disconnect(): void {
		if (this.stompClient !== null) {
			this.stompClient.deactivate();
		}
	}

	private errorCallBack(error: any): void {
		console.log('errorCallBack -> ' + error);
		setTimeout(() => {
			this.connect();
		}, 5000);
	}
}
