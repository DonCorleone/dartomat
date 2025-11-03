import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatingMode } from './calculating-mode';

describe('CalculatingMode', () => {
  let component: CalculatingMode;
  let fixture: ComponentFixture<CalculatingMode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatingMode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculatingMode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
