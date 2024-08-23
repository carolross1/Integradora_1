import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregasProveedorComponent } from './entregas-proveedor.component';

describe('EntregasProveedorComponent', () => {
  let component: EntregasProveedorComponent;
  let fixture: ComponentFixture<EntregasProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntregasProveedorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntregasProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
