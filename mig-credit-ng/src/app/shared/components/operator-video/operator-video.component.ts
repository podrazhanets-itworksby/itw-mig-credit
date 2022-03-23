import { Component, HostListener, OnDestroy, Output, EventEmitter } from '@angular/core';
import { OpenVidu, Publisher, Session, Stream, StreamEvent, StreamManager } from 'openvidu-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SessionData } from 'src/app/shared/model/session-data.model';
import { SessionService } from 'src/app/shared/services/session.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'mig-operator-video',
	templateUrl: './operator-video.component.html',
	styleUrls: ['./operator-video.component.scss'],
})
export class OperatorVideoComponent implements OnDestroy {
	@Output() private streamCreated: EventEmitter<any>;
	@Output() private streamDestroyed: EventEmitter<any>;

	public session: Session;
	public subscriber: StreamManager;
	public mainStreamManager: StreamManager;

	private OV: OpenVidu;
	private sessionId: string;
	private clientStream: Stream;
	private readonly destroy$: Subject<void>;

	public constructor(private sessionService: SessionService) {
		this.destroy$ = new Subject<void>();
		this.streamCreated = new EventEmitter<any>();
		this.streamDestroyed = new EventEmitter<any>();
	}

	/**
	 * Реакция на закрытие или перезагрузку вкладки
	 */
	@HostListener('window:beforeunload')
	public beforeunloadHandler(): void {
		this.leaveSession();
	}

	public ngOnDestroy(): void {
		this.destroy$.next();
		this.leaveSession();
	}

	/**
	 * Создание свободной сессии
	 */
	public createSession(): void {
		this.sessionService
			.createSession()
			.pipe(takeUntil(this.destroy$))
			.subscribe((data: SessionData) => {
				if (data) {
					this.sessionId = data.sessionId;
					this.initOperator(data);
				}
			});
	}

	/**
	 * Отключение от сессии
	 */
	public leaveSession(): void {
		if (!this.sessionId) {
			return;
		}

		this.sessionService
			.disconnectOperatorFromSession(this.sessionId)
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {});

		delete this.subscriber;
		delete this.sessionId;
		delete this.clientStream;
		delete this.session;
		delete this.OV;
		this.sessionService.setSessionId(null);
	}

	/**
	 * Инициализация сессии, содание аудио потока
	 * @param data данные сесии
	 */
	private initOperator(data: SessionData): void {
		this.OV = new OpenVidu();
		if (environment.production) {
			this.OV.setAdvancedConfiguration({
				iceServers: [
					{ urls: `stun:${environment.coturnUrl}:3478` },
					{
						urls: [
							`turn:${environment.coturnUrl}:3478`,
							`turn:${environment.coturnUrl}:3478?transport=tcp`,
						],
						username: environment.coturnUsername,
						credential: environment.coturnPassword,
					},
				],
			});
		}
		this.session = this.OV.initSession();
		this.session.on('streamCreated', (event: StreamEvent) => {
			const subscriber = this.session.subscribe(event.stream, undefined);
			this.clientStream = event.stream;
			this.subscriber = subscriber;
			this.streamCreated.emit();
		});

		this.session.on('streamDestroyed', (event: StreamEvent) => {
			delete this.subscriber;
			this.streamDestroyed.emit();
		});

		this.session.on('exception', (exception) => {
			console.warn(exception);
		});

		this.session
			.connect(data.token, { clientData: '' })
			.then(() => {
				const publisher: Publisher = this.OV.initPublisher(undefined, {
					audioSource: undefined, // Источник аудио. undefined - микрофон по умолчанию
					videoSource: false, // Источник видео. false - без видео
					publishAudio: true, // Начать сразу с включенным звуком
					publishVideo: false, // Начать сразу с включенным видео
				});
				this.session.publish(publisher);
				this.mainStreamManager = publisher;
			})
			.catch((error) => {
				console.log('There was an error connecting to the session:', error.code, error.message);
			});
	}
}
