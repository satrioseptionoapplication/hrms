import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FinanceRoutingModule } from './finance-routing.module';

import { OvertimesComponent } from './overtime/overtime.component';
import { ReimbusementsComponent } from './reimbusement/reimbusement.component';

const COMPONENTS: any[] = [OvertimesComponent, ReimbusementsComponent];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [SharedModule, FinanceRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
})
export class FinanceModule {}
