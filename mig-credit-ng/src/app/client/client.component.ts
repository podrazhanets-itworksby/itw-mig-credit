import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'mig-client',
	templateUrl: './client.component.html',
	styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit {
	public sessionId: string;
	public videoCallEndpoint: SafeUrl;

	public constructor(private sanitizer: DomSanitizer) {
		this.videoCallEndpoint = sanitizer.bypassSecurityTrustResourceUrl(environment.videoCallEndpoint + '/operator');
	}

	public ngOnInit(): void {
		window.addEventListener('message', (event) => {
			if (event.origin != environment.videoCallEndpoint) {
				return;
			}

			this.sessionId = event.data;
		});
	}
}
