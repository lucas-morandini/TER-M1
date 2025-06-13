import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentBetsComponent } from './current-bets.component';
import { ActivatedRoute } from '@angular/router';
import { mockActivatedRoute } from '../../activated-route.mock';


describe('CurrentBetsComponent', () => {
  let component: CurrentBetsComponent;
  let fixture: ComponentFixture<CurrentBetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentBetsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute } // Fournir le mock
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
