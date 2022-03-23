import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/shared/services/session.service';

@Component({
	selector: 'mig-client',
	templateUrl: './client.component.html',
	styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit {
	public sessionId: string;

	public constructor(private sessionService: SessionService) {}

	public ngOnInit(): void {
		this.initializeListeners();
	}

	private initializeListeners(): void {
		this.sessionService.getSessionId().subscribe((value: string) => {
			this.sessionId = value;
		});
	}
}
