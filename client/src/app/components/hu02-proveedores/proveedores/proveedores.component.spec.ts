import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedorFormComponent } from './proveedores.component';

describe('ProveedoresComponent', () => {
  let component: ProveedorFormComponent;
  let fixture: ComponentFixture<ProveedorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProveedorFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProveedorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
