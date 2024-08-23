import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosFrecuentesComponent } from './inventarios-frecuentes.component';

describe('InventariosFrecuentesComponent', () => {
  let component: InventariosFrecuentesComponent;
  let fixture: ComponentFixture<InventariosFrecuentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventariosFrecuentesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventariosFrecuentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
