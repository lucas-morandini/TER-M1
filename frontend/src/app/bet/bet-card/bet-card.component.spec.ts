import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BetCardComponent } from './bet-card.component';

describe('BetCardComponent', () => {
  let component: BetCardComponent;
  let fixture: ComponentFixture<BetCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a defined component', () => {
    expect(component).toBeDefined();
  });

  it('should have a default bet property', () => {
    expect(component.bet).toBeDefined();
  });
});
