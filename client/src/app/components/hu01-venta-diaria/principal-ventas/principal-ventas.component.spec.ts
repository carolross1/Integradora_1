import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalVentasComponent } from './principal-ventas.component';

describe('PrincipalVentasComponent', () => {
  let component: PrincipalVentasComponent;
  let fixture: ComponentFixture<PrincipalVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrincipalVentasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrincipalVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
