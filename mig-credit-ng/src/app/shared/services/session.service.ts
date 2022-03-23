import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SessionData } from 'src/app/shared/model/session-data.model';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class SessionService {
	public freeSessionId$: Subject<string>;
	public clientDisconnected$: Subject<boolean>;
	public sessionId$: Subject<string>;

	private host: string;

	constructor(private httpClient: HttpClient) {
		this.host = environment.host;
		this.freeSessionId$ = new Subject();
		this.clientDisconnected$ = new Subject();
		this.sessionId$ = new Subject();
	}

	/**
	 * Создание сессии оператором
	 * @returns Данные созданной сессии
	 */
	public createSession(): Observable<SessionData> {
		return this.httpClient.post<SessionData>(`${this.host}/api/session/create`, {}).pipe(
			map((value: SessionData) => {
				this.setSessionId(value.sessionId);
				return value;
			})
		);
	}

	/**
	 * Получение клиентом свободной сессии
	 * @param clientUniqueId уникальный идентификатор клиента
	 * @returns Идентификатор свободной сессии
	 */
	public getFreeSessionSse(clientUniqueId: string): void {
		const eventSource = new EventSource(`${this.host}/api/${clientUniqueId}/session/get-free`);
		eventSource.onmessage = (event) => {
			this.freeSessionId$.next(event.data);
			eventSource.close();
		};
	}

	/**
	 * Отмена ожидания свободного оператора
	 * @param clientUniqueId уникальный идентификатор клиента
	 */
	public endWaiting(clientUniqueId: string): Observable<void> {
		return this.httpClient.post<void>(`${this.host}/api/${clientUniqueId}/session/end-waiting`, {});
	}

	/**
	 * Получение данных для присоединения к сессии
	 * @param sessionId Идентификатор сессии
	 * @returns Данные для присоединения к сессии - идентификатор и токен
	 */
	public getDataToJoinTheSession(sessionId: string): Observable<SessionData> {
		return this.httpClient.get<SessionData>(`${this.host}/api/session/${sessionId}/get-data-to-join`).pipe(
			map((value: SessionData) => {
				this.setSessionId(value.sessionId);
				return value;
			})
		);
	}

	/**
	 * Отключения клиента от сессии.
	 * @param sessionId Идентификатор сессии
	 */
	public disconnectClientFromSession(sessionId: string): Observable<void> {
		return this.httpClient.post<void>(`${this.host}/api/session/${sessionId}/disconnect-client`, {});
	}

	/**
	 * Отключения оператора от сессии.
	 * @param sessionId Идентификатор сессии
	 */
	public disconnectOperatorFromSession(sessionId: string): Observable<void> {
		return this.httpClient.post<void>(`${this.host}/api/session/${sessionId}/disconnect-operator`, {});
	}

	/**
	 * Слушатель на случай прерывания сесии оператором
	 * @param sessionId идентификатор сесиии
	 */
	public setDisconnectListener(sessionId: string): void {
		const eventSource = new EventSource(`${this.host}/api/session/${sessionId}/disconnect-listener`);
		eventSource.onmessage = (event) => {
			this.clientDisconnected$.next(event.data);
			this.setSessionId(null);
			eventSource.close();
		};
	}

	/**
	 * Получение Id созданной оператором сессии
	 * @returns id созданной сессии
	 */
	public getSessionId(): Observable<string> {
		return this.sessionId$.asObservable();
	}

	/**
	 * Установка Id созданной оператором сессии
	 */
	public setSessionId(sessionId: string | null): void {
		this.sessionId$.next(sessionId);
	}
}
