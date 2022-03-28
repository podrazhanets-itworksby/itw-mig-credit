import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class FileService {
	private host: string;

	public constructor(private http: HttpClient) {
		this.host = environment.host;
	}

	public saveFile(file: FormData): Observable<string> {
		return this.http.post<string>(`${environment.host}/api/file/save`, file);
	}
}
