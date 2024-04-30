import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimesComponent } from './overtimes.component';

describe('OvertimesComponent', () => {
  let component: OvertimesComponent;
  let fixture: ComponentFixture<OvertimesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OvertimesComponent],
    });
    fixture = TestBed.createComponent(OvertimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
