import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ClientRoutingModule } from "src/app/client/client-routing.module";
import { ClientComponent } from "src/app/client/client.component";

@NgModule({
  declarations: [ClientComponent],
  imports: [CommonModule, ClientRoutingModule],
  exports: [ClientComponent],
})
export class ClientModule {}
