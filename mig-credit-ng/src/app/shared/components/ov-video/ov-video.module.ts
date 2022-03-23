import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OpenViduVideoComponent } from 'src/app/shared/components/ov-video/ov-video.component';

@NgModule({
	declarations: [OpenViduVideoComponent],
	imports: [CommonModule],
	exports: [OpenViduVideoComponent],
})
export class OpenViduVideoModule {}
