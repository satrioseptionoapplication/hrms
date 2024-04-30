import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { HCMRoutingModule } from './hcm-routing.module';

import { LeaveComponent } from './leave/leave.component';
import { EmployeeComponent } from '../hcm/employee/employee.component';
import { LeaveEmployeeComponent } from './leave-employee/leave-employee.component';
import { LeaveApprovalComponent } from './leave-approval/leave-approval.component';

const COMPONENTS: any[] = [
  LeaveComponent,
  EmployeeComponent,
  LeaveEmployeeComponent,
  LeaveApprovalComponent,
];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [SharedModule, HCMRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
})
export class HCMModule {}
