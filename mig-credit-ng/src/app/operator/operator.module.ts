import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { OperatorRoutingModule } from 'src/app/operator/operator-routing.module';
import { OperatorComponent } from 'src/app/operator/operator.component';
import { ApplicationFormModule } from 'src/app/shared/components/application-form.module';

@NgModule({
	declarations: [OperatorComponent],
	imports: [CommonModule, OperatorRoutingModule, ApplicationFormModule, ToastModule],
	exports: [OperatorComponent],
})
export class OperatorModule {}
