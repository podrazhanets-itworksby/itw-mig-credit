import { Injectable } from '@angular/core';
import { CompatClient, IMessage, Stomp } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { NewData } from 'src/app/shared/model/new-data.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
	private webSocketEndPoint: string;
	private topic: string;
	private stompClient: CompatClient;
	private subject: Subject<NewData>;

	public constructor() {
		this.webSocketEndPoint = environment.webSocketEndPoint;
		this.topic = '/topic/output/';
		this.subject = new Subject();
	}

	public connect(): void {
		let ws = new SockJS(this.webSocketEndPoint);
		this.stompClient = Stomp.over(ws);
		this.stompClient.connect({}, () => {}, this.errorCallBack);
	}

	public sendNewData(data: NewData): void {
		this.stompClient.send('/app/new-data', {}, JSON.stringify(data));
	}

	public connectAndSubscribe(sessionId: string): Observable<NewData> {
		let ws = new SockJS(this.webSocketEndPoint);
		this.stompClient = Stomp.over(ws);
		this.stompClient.connect(
			{},
			() => {
				this.stompClient.subscribe(this.topic + sessionId, (sdkEvent) => {
					this.onMessageReceived(sdkEvent);
				});
			},
			this.errorCallBack
		);
		return this.subject.asObservable();
	}

	private errorCallBack(error: any): void {
		console.log('errorCallBack -> ' + error);
		setTimeout(() => {
			this.connect();
		}, 5000);
	}

	private onMessageReceived(message: IMessage): void {
		this.subject.next(new NewData(JSON.parse(message.body)));
	}
}
