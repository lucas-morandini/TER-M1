import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinishedBetsComponent } from './finished-bets.component';
import { ActivatedRoute } from '@angular/router';
import { mockActivatedRoute } from '../../activated-route.mock';


describe('FinishedBetsComponent', () => {
  let component: FinishedBetsComponent;
  let fixture: ComponentFixture<FinishedBetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinishedBetsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute } // Fournir le mock
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishedBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
