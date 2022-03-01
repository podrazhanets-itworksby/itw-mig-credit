import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClientRoutingModule } from 'src/app/client/client-routing.module';
import { ClientComponent } from 'src/app/client/client.component';
import { ApplicationFormModule } from 'src/app/shared/components/application-form.module';

@NgModule({
	declarations: [ClientComponent],
	imports: [CommonModule, ClientRoutingModule, ApplicationFormModule],
	exports: [ClientComponent],
})
export class ClientModule {}
