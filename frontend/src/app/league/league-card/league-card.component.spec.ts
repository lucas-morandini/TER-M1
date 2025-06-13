import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stores } from '../../../../stores/Stores';
import { LeagueCardComponent } from './league-card.component';

describe('LeagueCardComponent', () => {
  let component: LeagueCardComponent;
  let fixture: ComponentFixture<LeagueCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeagueCardComponent],
      providers: [Stores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeagueCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
