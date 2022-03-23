import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class RecorderService {
	private host: string;

	constructor(private httpClient: HttpClient) {
		this.host = environment.host;
	}

	/**
	 * Начать запись сессии.
	 * @param sessionId Идентификатор сессии
	 */
	public startRecordVideo(sessionId: string): Observable<void> {
		return this.httpClient.post<void>(`${this.host}/api/recorder/${sessionId}/record-video`, {});
	}
}
