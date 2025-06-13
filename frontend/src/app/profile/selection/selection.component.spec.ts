import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectionComponent } from './selection.component';
import { ActivatedRoute } from '@angular/router';
import { mockActivatedRoute } from '../../activated-route.mock';


describe('SelectionComponent', () => {
  let component: SelectionComponent;
  let fixture: ComponentFixture<SelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute } // Fournir le mock
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
