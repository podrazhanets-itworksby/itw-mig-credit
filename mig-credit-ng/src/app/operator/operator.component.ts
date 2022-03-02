import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Application } from 'src/app/shared/model/application.model';
import { OperatorService } from 'src/app/shared/services/operator.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'mig-operator',
	templateUrl: './operator.component.html',
	styleUrls: ['./operator.component.scss'],
	providers: [MessageService],
})
export class OperatorComponent implements OnInit, OnDestroy {
	public sessionId: string;
	public videoCallEndpoint: SafeUrl;

	private readonly destroy$: Subject<void>;

	constructor(
		private operatorService: OperatorService,
		private messageService: MessageService,
		private sanitizer: DomSanitizer
	) {
		this.destroy$ = new Subject<void>();
		this.videoCallEndpoint = sanitizer.bypassSecurityTrustResourceUrl(environment.videoCallEndpoint + '/operator');
		console.log(this.videoCallEndpoint);
	}

	public ngOnInit(): void {
		window.addEventListener('message', (event) => {
			if (event.origin != environment.videoCallEndpoint) {
				return;
			}

			this.sessionId = event.data;
		});
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
			});
	}
}
