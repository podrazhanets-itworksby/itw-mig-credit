import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { StreamManager } from 'openvidu-browser';

@Component({
	selector: 'mig-video',
	templateUrl: './ov-video.component.html',
})
export class OpenViduVideoComponent implements AfterViewInit {
	@ViewChild('videoElement') public elementRef: ElementRef;
	@Input() public hidden: boolean;

	private _streamManager: StreamManager;

	public constructor() {
		this.hidden = false;
	}

	public ngAfterViewInit(): void {
		this._streamManager.addVideoElement(this.elementRef.nativeElement);
	}

	@Input()
	public set streamManager(streamManager: StreamManager) {
		this._streamManager = streamManager;
		if (!!this.elementRef) {
			this._streamManager.addVideoElement(this.elementRef.nativeElement);
		}
	}
}
