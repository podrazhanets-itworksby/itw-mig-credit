import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { OperatorRoutingModule } from "src/app/operator/operator-routing.module";
import { OperatorComponent } from "src/app/operator/operator.component";

@NgModule({
  declarations: [OperatorComponent],
  imports: [CommonModule, OperatorRoutingModule],
  exports: [OperatorComponent],
})
export class OperatorModule {}
