import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosAProveedorComponent } from './pedidos-a-proveedor.component';

describe('PedidosAProveedorComponent', () => {
  let component: PedidosAProveedorComponent;
  let fixture: ComponentFixture<PedidosAProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PedidosAProveedorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PedidosAProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
