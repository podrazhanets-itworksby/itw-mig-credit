import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClientRoutingModule } from 'src/app/client/client-routing.module';
import { ClientComponent } from 'src/app/client/client.component';
import { ApplicationFormModule } from 'src/app/shared/components/application-form/application-form.module';
import { ClientVideoModule } from 'src/app/shared/components/client-video/client-video.module';

@NgModule({
	declarations: [ClientComponent],
	imports: [CommonModule, ClientRoutingModule, ApplicationFormModule, ClientVideoModule],
	exports: [ClientComponent],
})
export class ClientModule {}
