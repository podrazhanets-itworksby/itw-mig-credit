import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "operator",
        loadChildren: () =>
          import("./operator/operator.module").then((m) => m.OperatorModule),
      },

      {
        path: "client",
        loadChildren: () =>
          import("./client/client.module").then((m) => m.ClientModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
