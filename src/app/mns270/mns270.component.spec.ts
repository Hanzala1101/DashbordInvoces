import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MNS270Component } from './mns270.component';

describe('MNS270Component', () => {
  let component: MNS270Component;
  let fixture: ComponentFixture<MNS270Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MNS270Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MNS270Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
