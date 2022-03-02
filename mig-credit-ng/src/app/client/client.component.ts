import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'mig-client',
	templateUrl: './client.component.html',
	styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit {
	public sessionId: string;
	public constructor() {}

	public ngOnInit(): void {
		window.addEventListener('message', (event) => {
			if (event.origin != environment.videoCallEndpoint) {
				return;
			}

			this.sessionId = event.data;
		});
	}
}
