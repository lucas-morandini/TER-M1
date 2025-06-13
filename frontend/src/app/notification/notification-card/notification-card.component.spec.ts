import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationCardComponent } from './notification-card.component';

describe('NotificationCardComponent', () => {
  let component: NotificationCardComponent;
  let fixture: ComponentFixture<NotificationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationCardComponent], // ✅ standalone = import
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationCardComponent);
    component = fixture.componentInstance;

    // ✅ simulate une Input() pour éviter l'erreur .title undefined
    component.notification = {
      title: 'Test',
      message: 'This is a test message',
      date: new Date(),
    } as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
