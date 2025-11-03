import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputMode } from './input-mode';

describe('InputMode', () => {
  let component: InputMode;
  let fixture: ComponentFixture<InputMode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputMode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputMode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
