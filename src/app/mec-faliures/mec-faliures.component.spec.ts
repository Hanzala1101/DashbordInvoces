import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MecFaliuresComponent } from './mec-faliures.component';

describe('MecFaliuresComponent', () => {
  let component: MecFaliuresComponent;
  let fixture: ComponentFixture<MecFaliuresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MecFaliuresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MecFaliuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
