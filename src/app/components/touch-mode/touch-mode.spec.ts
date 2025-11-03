import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchMode } from './touch-mode';

describe('TouchMode', () => {
  let component: TouchMode;
  let fixture: ComponentFixture<TouchMode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TouchMode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TouchMode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
