import { NgModule } from '@angular/core';
import { UseUtcDirective } from 'src/app/shared/directives/use-utc/use-utc.directive';

@NgModule({
  declarations: [UseUtcDirective],
  exports: [UseUtcDirective],
})
export class UseUtcModule {}
