import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperatorComponent } from 'src/app/operator/operator.component';

const routes: Routes = [
	{
		path: '',
		component: OperatorComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class OperatorRoutingModule {}
