import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TrainingRoutingModule } from './training-routing.module';

import { TrainingListComponent } from './list-training/training-list.component';
import { TrainersComponent } from './trainers/trainers.component';
import { TrainingTypesComponent } from './training-type/training-type.component';

const COMPONENTS: any[] = [TrainingListComponent, TrainersComponent, TrainingTypesComponent];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [SharedModule, TrainingRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
})
export class TrainingModule {}
