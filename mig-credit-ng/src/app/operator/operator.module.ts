import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { OperatorRoutingModule } from 'src/app/operator/operator-routing.module';
import { OperatorComponent } from 'src/app/operator/operator.component';
import { ApplicationFormModule } from 'src/app/shared/components/application-form/application-form.module';
import { OperatorVideoModule } from 'src/app/shared/components/operator-video/operator-video.module';

@NgModule({
	declarations: [OperatorComponent],
	imports: [CommonModule, OperatorRoutingModule, ApplicationFormModule, ToastModule, OperatorVideoModule],
	exports: [OperatorComponent],
})
export class OperatorModule {}
