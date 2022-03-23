import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OperatorVideoComponent } from 'src/app/shared/components/operator-video/operator-video.component';
import { OpenViduVideoModule } from 'src/app/shared/components/ov-video/ov-video.module';

@NgModule({
	declarations: [OperatorVideoComponent],
	imports: [CommonModule, OpenViduVideoModule],
	exports: [OperatorVideoComponent],
})
export class OperatorVideoModule {}
