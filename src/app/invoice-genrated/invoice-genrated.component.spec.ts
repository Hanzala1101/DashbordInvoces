import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceGenratedComponent } from './invoice-genrated.component';

describe('InvoiceGenratedComponent', () => {
  let component: InvoiceGenratedComponent;
  let fixture: ComponentFixture<InvoiceGenratedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceGenratedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceGenratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
