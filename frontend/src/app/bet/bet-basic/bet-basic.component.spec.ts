import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetBasicComponent } from './bet-basic.component';

describe('BetBasicComponent', () => {
  let component: BetBasicComponent;
  let fixture: ComponentFixture<BetBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetBasicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BetBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
