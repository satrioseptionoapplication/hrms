import { Routes, RouterModule } from '@angular/router';

import { OvertimesComponent } from './overtime/overtime.component';
import { ReimbusementsComponent } from './reimbusement/reimbusement.component';

const routes: Routes = [
  { path: 'overtime', component: OvertimesComponent },
  { path: 'reimbusement', component: ReimbusementsComponent },
];

export const FinanceRoutingModule = RouterModule.forChild(routes);
