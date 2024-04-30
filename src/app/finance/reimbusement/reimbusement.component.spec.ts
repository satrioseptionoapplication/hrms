import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbusementsComponent } from './reimbusements.component';

describe('ReimbusementsComponent', () => {
  let component: ReimbusementsComponent;
  let fixture: ComponentFixture<ReimbusementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReimbusementsComponent],
    });
    fixture = TestBed.createComponent(ReimbusementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
