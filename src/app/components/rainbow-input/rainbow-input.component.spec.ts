import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainbowInputComponent } from './rainbow-input.component';

describe('RainbowInputComponent', () => {
  let component: RainbowInputComponent;
  let fixture: ComponentFixture<RainbowInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RainbowInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RainbowInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
