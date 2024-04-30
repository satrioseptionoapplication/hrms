import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingTypesComponent } from './trainers.component';

describe('TrainingTypesComponent', () => {
  let component: TrainingTypesComponent;
  let fixture: ComponentFixture<TrainingTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingTypesComponent],
    });
    fixture = TestBed.createComponent(TrainingTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
