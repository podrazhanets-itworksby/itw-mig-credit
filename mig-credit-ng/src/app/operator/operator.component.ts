import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'mig-operator',
	templateUrl: './operator.component.html',
	styleUrls: ['./operator.component.scss'],
})
export class OperatorComponent implements OnInit {
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
