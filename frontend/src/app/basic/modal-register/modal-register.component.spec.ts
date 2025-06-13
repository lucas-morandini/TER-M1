import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalRegisterComponent } from './modal-register.component';
import { Stores } from '../../../../stores/Stores';
import { AuthService } from '../../auth.service';

// Mocks pour les services
class MockStores {
  userStore = {
    register: jasmine.createSpy('register').and.returnValue(Promise.resolve({ id: 1 }))
  };
}

class MockAuthService {
  login = jasmine.createSpy('login');
}

describe('ModalRegisterComponent', () => {
  let component: ModalRegisterComponent;
  let fixture: ComponentFixture<ModalRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRegisterComponent, CommonModule, ReactiveFormsModule], // ReactiveFormsModule au lieu de FormsModule
      providers: [
        FormBuilder,
        { provide: Stores, useClass: MockStores },
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize reactive form with empty values', () => {
    expect(component.registerForm).toBeDefined();
    expect(component.registerForm.get('username')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.registerForm.get('confirmPassword')?.value).toBe('');
    expect(component.registerForm.get('tel')?.value).toBe('');
    expect(component.registerForm.get('sex')?.value).toBe('');
    expect(component.registerForm.get('name')?.value).toBe('');
    expect(component.registerForm.get('first_name')?.value).toBe('');
  });

  it('should require all fields', () => {
    expect(component.registerForm.valid).toBeFalsy();

    // Vérifier que tous les champs sont requis
    expect(component.registerForm.get('username')?.hasError('required')).toBeTruthy();
    expect(component.registerForm.get('email')?.hasError('required')).toBeTruthy();
    expect(component.registerForm.get('password')?.hasError('required')).toBeTruthy();
    expect(component.registerForm.get('confirmPassword')?.hasError('required')).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.registerForm.get('email');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should validate password strength', () => {
    const passwordControl = component.registerForm.get('password');

    // Test avec un mot de passe faible
    passwordControl?.setValue('weak');
    expect(passwordControl?.hasError('hasUpperCase')).toBeTruthy();

    // Test avec un mot de passe fort
    passwordControl?.setValue('StrongPass123!');
    expect(passwordControl?.valid).toBeTruthy();
  });

  it('should validate password match', () => {
    component.registerForm.get('password')?.setValue('Password123!');
    component.registerForm.get('confirmPassword')?.setValue('DifferentPassword123!');

    expect(component.registerForm.hasError('passwordMismatch')).toBeTruthy();

    component.registerForm.get('confirmPassword')?.setValue('Password123!');
    expect(component.registerForm.hasError('passwordMismatch')).toBeFalsy();
  });

  it('should emit closeModalEvent when closeModal is called', () => {
    spyOn(component.closeModalEvent, 'emit');
    component.closeModal();
    expect(component.closeModalEvent.emit).toHaveBeenCalled();
  });
});
