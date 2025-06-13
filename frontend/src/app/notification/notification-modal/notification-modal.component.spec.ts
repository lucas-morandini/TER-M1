import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationModalComponent } from './notification-modal.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { Notification } from '../../../../commons/Notification';
import { CommonModule } from '@angular/common';

describe('NotificationModalComponent', () => {
  let component: NotificationModalComponent;
  let fixture: ComponentFixture<NotificationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NotificationModalComponent, // ✅ composant standalone à importer ici
        CommonModule,
        MatDialogModule,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: jasmine.createSpy('close') }, // ✅ mock MatDialogRef
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            notification: new Notification(0, new Date(), new Date(), 'msg', 0, 'titre')
          },
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
