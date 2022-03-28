import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { StreamManager } from 'openvidu-browser';

@Component({
	selector: 'mig-video',
	templateUrl: './ov-video.component.html',
})
export class OpenViduVideoComponent implements AfterViewInit {
	@ViewChild('videoElement') public elementRef: ElementRef;
	@Input() public hidden: boolean;
	@Input() public width: number;
	@Input() public height: number;

	private _streamManager: StreamManager;

	public constructor() {
		this.hidden = false;
		this.width = 1280;
		this.height = 720;
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

	public getVideoElement(): any {
		return this.elementRef.nativeElement;
	}

	public getWidth(): string {
		return this.elementRef.nativeElement.clientWidth;
	}
}
