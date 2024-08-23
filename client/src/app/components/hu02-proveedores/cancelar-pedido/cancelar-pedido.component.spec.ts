import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelarPedidoComponent } from './cancelar-pedido.component';

describe('CancelarPedidoComponent', () => {
  let component: CancelarPedidoComponent;
  let fixture: ComponentFixture<CancelarPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelarPedidoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CancelarPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
