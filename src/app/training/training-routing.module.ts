import { Routes, RouterModule } from '@angular/router';

import { TrainingListComponent } from './list-training/training-list.component';
import { TrainersComponent } from './trainers/trainers.component';
import { TrainingTypesComponent } from './training-type/training-type.component';

const routes: Routes = [
  { path: 'training-list', component: TrainingListComponent },
  { path: 'trainers', component: TrainersComponent },
  { path: 'training-type', component: TrainingTypesComponent },
];

export const TrainingRoutingModule = RouterModule.forChild(routes);
