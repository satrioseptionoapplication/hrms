import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DocumentRoutingModule } from './document-routing.module';

import { DocumentComponent } from './requestor/document.component';
import { DocumentApprovalComponent } from './approval/document-approval.component';

const COMPONENTS: any[] = [DocumentComponent, DocumentApprovalComponent];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [SharedModule, DocumentRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
})
export class DocumentModule {}
