import { Routes, RouterModule } from '@angular/router';

import { DocumentComponent } from './requestor/document.component';
import { DocumentApprovalComponent } from './approval/document-approval.component';

const routes: Routes = [
  { path: 'document-list', component: DocumentComponent },
  { path: 'document-approval', component: DocumentApprovalComponent },
];

export const DocumentRoutingModule = RouterModule.forChild(routes);
