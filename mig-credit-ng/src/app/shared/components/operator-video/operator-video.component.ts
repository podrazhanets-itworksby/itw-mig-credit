import { Component, HostListener, OnDestroy, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { OpenVidu, Publisher, Session, Stream, StreamEvent, StreamManager } from 'openvidu-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OpenViduVideoComponent } from 'src/app/shared/components/ov-video/ov-video.component';
import { SessionData } from 'src/app/shared/model/session-data.model';
import { FileService } from 'src/app/shared/services/file.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'mig-operator-video',
	templateUrl: './operator-video.component.html',
	styleUrls: ['./operator-video.component.scss'],
})
export class OperatorVideoComponent implements OnDestroy {
	@ViewChild('clientVideo') public openViduVideoComponent: OpenViduVideoComponent;
	@Output() private streamCreated: EventEmitter<any>;
	@Output() private streamDestroyed: EventEmitter<any>;

	public session: Session;
	public subscriber: StreamManager;
	public mainStreamManager: StreamManager;
	public videoWidth: number;
	public videoHeight: number;
	public showTakePictureBtn: boolean;
	public showRemovePictureBtn: boolean;

	private OV: OpenVidu;
	private sessionId: string;
	private clientStream: Stream;
	private readonly destroy$: Subject<void>;
	private file: File;
	private imgCount: number;

	public constructor(private sessionService: SessionService, private fileService: FileService) {
		this.destroy$ = new Subject<void>();
		this.streamCreated = new EventEmitter<any>();
		this.streamDestroyed = new EventEmitter<any>();
		this.videoWidth = 1280;
		this.videoHeight = 720;
		this.imgCount = 0;
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
		this.showTakePictureBtn = false;
		this.showRemovePictureBtn = false;
	}

	/**
	 * взять кадр из видео транслируемого клиентом
	 */
	public takePicture(): void {
		const canvas = document.getElementById('canvas') as HTMLCanvasElement;
		const context = canvas.getContext('2d');
		const video = this.openViduVideoComponent.getVideoElement();
		const picture = document.getElementById('picture');
		canvas.width = this.videoWidth;
		canvas.height = this.videoHeight;
		context.drawImage(video, 0, 0, this.videoWidth, this.videoHeight);

		const data = canvas.toDataURL('image/png');
		picture.setAttribute('src', data);
		// picture.style.width = document.getElementById('clientVideoDiv').clientWidth + 'px';
		canvas.toBlob((blob) => {
			this.file = new File([blob], this.sessionId + '_' + this.imgCount + '.jpg', { type: 'image/jpeg' });
		}, 'image/jpeg');

		console.log(data);
		this.showTakePictureBtn = false;
		this.showRemovePictureBtn = true;
	}

	/**
	 * сохранение сделанного изображения
	 */
	public savePicture(): void {
		const formData: FormData = new FormData();
		formData.append('file', this.file, this.file.name);
		formData.append('sessionId', this.sessionId.toString());
		this.fileService
			.saveFile(formData)
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				this.removePicture();
				this.imgCount++;
			});
	}

	/**
	 * Удаление сделанного изображения
	 */
	public removePicture(): void {
		const canvas = document.getElementById('canvas') as HTMLCanvasElement;
		canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
		const picture = document.getElementById('picture');
		picture.removeAttribute('src');
		this.showRemovePictureBtn = false;
		this.showTakePictureBtn = true;
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
			this.showTakePictureBtn = true;
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
