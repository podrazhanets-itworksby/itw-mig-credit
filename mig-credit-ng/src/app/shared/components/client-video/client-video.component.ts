import { Component, ElementRef, HostListener, OnDestroy, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { OpenVidu, Publisher, Session, StreamEvent, StreamManager } from 'openvidu-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SessionData } from 'src/app/shared/model/session-data.model';
import { RecorderService } from 'src/app/shared/services/recorder.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { environment } from 'src/environments/environment';
import { v4 } from 'uuid';

@Component({
	selector: 'mig-client-video',
	templateUrl: './client-video.component.html',
	styleUrls: ['./client-video.component.scss'],
})
export class ClientVideoComponent implements OnInit, OnDestroy {
	@Output() streamCreated: EventEmitter<any>;
	@Output() streamDestroyed: EventEmitter<any>;

	public session: Session;
	public sessionId: string;
	public sessionFound: boolean;
	public gettingFreeSession: boolean;
	public mainStreamManager: StreamManager;
	public subscriber: StreamManager;

	@ViewChild('notification') public notification: ElementRef;

	private OV: OpenVidu;
	private interval: any;
	private clientUniqueId: string;
	private readonly destroy$: Subject<void>;

	public constructor(private sessionService: SessionService, private recorderService: RecorderService) {
		this.destroy$ = new Subject<void>();
		this.gettingFreeSession = false;
		this.sessionFound = false;

		// При изменении переменных в подписке на ответ Sse форма не реагирует на их обновление
		// Данный кастыль решает данную проблему
		this.interval = setInterval(() => {
			this.session;
			this.mainStreamManager;
		}, 500);

		this.streamCreated = new EventEmitter<any>();
		this.streamDestroyed = new EventEmitter<any>();
	}

	/**
	 * Реакция на закрытие или перезагрузку вкладки
	 */
	@HostListener('window:beforeunload')
	public beforeunloadHandler(): void {
		this.leaveSession();
		clearInterval(this.interval);
	}

	public ngOnInit(): void {
		this.initializeListeners();
	}

	public ngOnDestroy(): void {
		this.destroy$.next();
		this.leaveSession();
		clearInterval(this.interval);
	}

	/**
	 * Получаем свободную сессию(оператора)
	 */
	public getFreeSession(): void {
		this.gettingFreeSession = true;
		this.clientUniqueId = v4();
		this.sessionService.getFreeSessionSse(this.clientUniqueId);
	}

	/**
	 * Отмена ожидания свободной сессии(оператора)
	 */
	public endWaiting(): void {
		if (this.clientUniqueId) {
			this.sessionService.endWaiting(this.clientUniqueId).subscribe(() => {
				this.gettingFreeSession = false;
			});
		}
	}

	/**
	 * Получение данных зарезервированной сесии для начала сеанса
	 */
	public getDataToJoinTheSession(): void {
		this.sessionService
			.getDataToJoinTheSession(this.sessionId)
			.pipe(takeUntil(this.destroy$))
			.subscribe((data: SessionData) => {
				if (data) {
					this.sessionFound = false;
					this.initClient(data);
				}
			});
	}

	/**
	 * Отключение от сессии
	 */
	public leaveSession(): void {
		if (this.sessionId) {
			this.sessionService
				.disconnectClientFromSession(this.sessionId)
				.pipe(takeUntil(this.destroy$))
				.subscribe(() => {});
		}

		if (this.session) {
			this.session.disconnect();
		}
		this.session = null;
		this.sessionId = null;
		this.OV = null;
		this.sessionService.freeSessionId$.next(null);
		this.sessionService.setSessionId(null);
	}

	/**
	 * Инициализация сессии, содание видео и аудио потока
	 * @param data данные сесии
	 */
	private initClient(data: SessionData): void {
		this.OV = new OpenVidu();
		this.session = this.OV.initSession();

		this.session.on('streamCreated', (event: StreamEvent) => {
			const subscriber = this.session.subscribe(event.stream, undefined);
			this.subscriber = subscriber;
			this.streamCreated.emit();
		});

		this.session.on('streamDestroyed', (event: StreamEvent) => {
			delete this.subscriber;
			this.sessionService.setSessionId(null);
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
					videoSource: undefined, // Источник видео. undefined - web камера по умолчанию
					publishAudio: true, // Начать сразу с включенным звуком
					publishVideo: true, // Начать сразу с включенным видео
					resolution: '1920x1080', // разрешение видео
					frameRate: 24, // частота кадров
					insertMode: 'APPEND', // способ вставки видео в элемент
					mirror: true, // Зеркальное отражение или нет
				});
				this.session.publish(publisher);
				this.mainStreamManager = publisher;
			})
			.catch((error) => {
				console.log('There was an error connecting to the session:', error.code, error.message);
			});

		this.recorderService
			.startRecordVideo(this.sessionId)
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {});
	}

	/**
	 * Инициализация слушателей Sse
	 */
	private initializeListeners(): void {
		this.sessionService.freeSessionId$.subscribe((sessionId: string) => {
			if (sessionId) {
				sessionId = sessionId.replace('"', '').replace('"', '');
				// Если клиент отменил ожидание свободной сесии, то вместо id сессии придет пустая строка
				if (!sessionId) {
					return;
				}

				// Получен ответ на запрос getFreeSessionSse и этот ответ содержит sessionId
				this.gettingFreeSession = false;
				this.sessionId = sessionId;
				this.sessionFound = true;

				// Устанавливаем слушателя на случай если оператор будет инициатором разрыва сесиии
				this.sessionService.setDisconnectListener(this.sessionId);

				this.notification.nativeElement.play();
			}
		});

		this.sessionService.clientDisconnected$.subscribe((disconnect: boolean) => {
			if (disconnect && this.session) {
				// Оператор разорвал соединение
				// Отключаемся от сессии
				this.session.disconnect();
				this.session = null;
				this.sessionId = null;
				this.OV = null;
				this.sessionService.freeSessionId$.next(null);
				this.sessionService.clientDisconnected$.next(false);
				this.sessionFound = false;
				this.gettingFreeSession = false;
			}
		});
	}
}
