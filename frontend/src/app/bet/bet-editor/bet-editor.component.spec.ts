import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BetEditorComponent } from './bet-editor.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('BetEditorComponent', () => {
  let component: BetEditorComponent;
  let fixture: ComponentFixture<BetEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetEditorComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1' // valeur fictive pour l'ID du pari
              }
            }
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BetEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
