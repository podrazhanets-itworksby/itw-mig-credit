import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OperatorVideoComponent } from 'src/app/shared/components/operator-video/operator-video.component';
import { Application } from 'src/app/shared/model/application.model';
import { OperatorService } from 'src/app/shared/services/operator.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { WebsocketService } from 'src/app/shared/services/websocket.service';

@Component({
	selector: 'mig-operator',
	templateUrl: './operator.component.html',
	styleUrls: ['./operator.component.scss'],
	providers: [MessageService],
})
export class OperatorComponent implements OnInit, OnDestroy {
	public sessionId: string;
	public actionButton: boolean;

	private readonly destroy$: Subject<void>;

	constructor(
		private operatorService: OperatorService,
		private messageService: MessageService,
		private sessionService: SessionService,
		private websocketService: WebsocketService
	) {
		this.destroy$ = new Subject<void>();
		this.actionButton = true;
	}

	public ngOnInit(): void {
		this.initializeListeners();
	}

	public ngOnDestroy(): void {
		this.destroy$.next();
	}

	public saveApplication(application: Application): void {
		this.operatorService
			.saveApplication(application, this.sessionId)
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				this.messageService.add({ key: 'responseInfo', severity: 'success', detail: 'Saved' });
				this.actionButton = false;
				this.sessionService.disconnectClientFromSession(this.sessionId).subscribe(() => {});
				this.websocketService.disconnect();
			});
	}

	private initializeListeners(): void {
		this.sessionService.getSessionId().subscribe((value: string) => {
			this.sessionId = value;
			this.websocketService.connectOperator(this.sessionId);
		});
	}
}
