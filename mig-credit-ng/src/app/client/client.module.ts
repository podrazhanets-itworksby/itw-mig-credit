import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClientRoutingModule } from 'src/app/client/client-routing.module';
import { ClientComponent } from 'src/app/client/client.component';
import { ApplicationFormModule } from 'src/app/shared/components/application-form/application-form.module';
import { ClientNotificationModule } from 'src/app/shared/components/client-notification/client-notification.module';
import { ClientVideoModule } from 'src/app/shared/components/client-video/client-video.module';

@NgModule({
	declarations: [ClientComponent],
	imports: [CommonModule, ClientRoutingModule, ApplicationFormModule, ClientVideoModule, ClientNotificationModule],
	exports: [ClientComponent],
})
export class ClientModule {}
