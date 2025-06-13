import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalConnectComponent } from './modal-connect.component';
import { Stores } from '../../../../stores/Stores';
import { AuthService } from '../../auth.service';

// Mocks pour les services
class MockStores {
  userStore = {
    connect: jasmine.createSpy('connect').and.returnValue(Promise.resolve({ id: 1 })),
    lostPassword: jasmine.createSpy('lostPassword').and.returnValue(Promise.resolve({ code: true }))
  };
}

class MockAuthService {
  login = jasmine.createSpy('login');
}

describe('ModalConnectComponent', () => {
  let component: ModalConnectComponent;
  let fixture: ComponentFixture<ModalConnectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalConnectComponent, CommonModule, ReactiveFormsModule], // ReactiveFormsModule au lieu de FormsModule
      providers: [
        FormBuilder,
        { provide: Stores, useClass: MockStores },
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize reactive form with empty values', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.loginForm.get('remember')?.value).toBe(false);
  });

  it('should require email and password fields', () => {
    expect(component.loginForm.valid).toBeFalsy();

    expect(component.loginForm.get('email')?.hasError('required')).toBeTruthy();
    expect(component.loginForm.get('password')?.hasError('required')).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.get('email');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should be valid when all required fields are filled correctly', () => {
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should have helper methods for validation', () => {
    expect(component.hasFieldError).toBeDefined();
    expect(component.getFieldError).toBeDefined();
  });

  it('should return correct field errors', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.markAsTouched();

    expect(component.hasFieldError('email')).toBeTruthy();
    expect(component.getFieldError('email')).toBe('L\'email est requis');
  });

  it('should emit closeModalEvent when closeModal is called', () => {
    spyOn(component.closeModalEvent, 'emit');
    component.closeModal();
    expect(component.closeModalEvent.emit).toHaveBeenCalled();
  });
});
