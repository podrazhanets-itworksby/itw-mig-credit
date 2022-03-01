import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ApplicationFormComponent } from 'src/app/shared/components/application-form.component';
import { UseUtcModule } from 'src/app/shared/directives/use-utc/use-utc.module';

@NgModule({
	declarations: [ApplicationFormComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		UseUtcModule,
		FormsModule,
		InputTextModule,
		DropdownModule,
		CalendarModule,
		NgxMaskModule,
		ConfirmDialogModule,
	],
	exports: [ApplicationFormComponent],
})
export class ApplicationFormModule {}
