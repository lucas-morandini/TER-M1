import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationBasicComponent } from './notification-basic.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('NotificationBasicComponent', () => {
  let component: NotificationBasicComponent;
  let fixture: ComponentFixture<NotificationBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationBasicComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 }),
            snapshot: {
              paramMap: {
                get: (key: string) => '1',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
