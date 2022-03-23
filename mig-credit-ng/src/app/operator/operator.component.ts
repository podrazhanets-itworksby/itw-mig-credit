import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Application } from 'src/app/shared/model/application.model';
import { OperatorService } from 'src/app/shared/services/operator.service';
import { SessionService } from 'src/app/shared/services/session.service';

@Component({
	selector: 'mig-operator',
	templateUrl: './operator.component.html',
	styleUrls: ['./operator.component.scss'],
	providers: [MessageService],
})
export class OperatorComponent implements OnInit, OnDestroy {
	public sessionId: string;
	public editMode: boolean;

	private readonly destroy$: Subject<void>;

	constructor(
		private operatorService: OperatorService,
		private messageService: MessageService,
		private sessionService: SessionService
	) {
		this.destroy$ = new Subject<void>();
		this.editMode = true;
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
				this.editMode = false;
			});
	}

	private initializeListeners(): void {
		this.sessionService.getSessionId().subscribe((value: string) => {
			this.sessionId = value;
		});
	}
}
