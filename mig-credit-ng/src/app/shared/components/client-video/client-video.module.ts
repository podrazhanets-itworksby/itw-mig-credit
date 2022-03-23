import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClientVideoComponent } from 'src/app/shared/components/client-video/client-video.component';

import { OpenViduVideoModule } from 'src/app/shared/components/ov-video/ov-video.module';

@NgModule({
	declarations: [ClientVideoComponent],
	imports: [CommonModule, OpenViduVideoModule],
	exports: [ClientVideoComponent],
})
export class ClientVideoModule {}
