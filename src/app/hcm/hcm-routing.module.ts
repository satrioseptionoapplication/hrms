import { Routes, RouterModule } from '@angular/router';

import { EmployeeComponent } from './employee/employee.component';
import { LeaveComponent } from './leave/leave.component';
import { LeaveEmployeeComponent } from './leave-employee/leave-employee.component';
import { LeaveApprovalComponent } from './leave-approval/leave-approval.component';

const routes: Routes = [
  { path: 'employee', component: EmployeeComponent },
  { path: 'leave', component: LeaveComponent },
  { path: 'leave-employee', component: LeaveEmployeeComponent },
  { path: 'leave-approval', component: LeaveApprovalComponent },
];

// @NgModule({
//   imports: [
//     RouterModule.forRoot(routes, {
//       useHash: environment.useHash,
//     }),
//   ],
//   exports: [RouterModule],
// })
// export class MasterRoutingModule {}

export const HCMRoutingModule = RouterModule.forChild(routes);
