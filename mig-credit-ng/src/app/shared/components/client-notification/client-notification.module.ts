import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ClientNotificationComponent } from 'src/app/shared/components/client-notification/client-notification.component';

@NgModule({
	declarations: [ClientNotificationComponent],
	imports: [CommonModule, ButtonModule],
	exports: [ClientNotificationComponent],
})
export class ClientNotificationModule {}
