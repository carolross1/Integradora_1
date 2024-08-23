import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaListComponent } from './venta-list.component';

describe('VentaListComponent', () => {
  let component: VentaListComponent;
  let fixture: ComponentFixture<VentaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VentaListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VentaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
