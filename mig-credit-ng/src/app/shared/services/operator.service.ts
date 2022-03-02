import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Application } from 'src/app/shared/model/application.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class OperatorService {
	private host: string;

	public constructor(private http: HttpClient) {
		this.host = environment.host;
	}

	public saveApplication(application: Application, sesionId: string): Observable<void> {
		return this.http.post<void>(`${this.host}/api/operator/${sesionId}/save-application`, application);
	}
}
