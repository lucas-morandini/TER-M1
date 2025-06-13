import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function passwordStrength(control : AbstractControl): ValidationErrors | null {
  const password = control.value;

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumeric = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isValidLength = password.length >= 8;

  const isValidPassword = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && isValidLength;

  const validationErrors = {
    hasUpperCase: !hasUpperCase,
    hasLowerCase: !hasLowerCase,
    hasNumeric: !hasNumeric,
    hasSpecialChar: !hasSpecialChar,
    isValidLength: !isValidLength,
  };

  return isValidPassword ? null : validationErrors;
}

function passwordMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
}

const PasswordValidator = {
  passwordMatch,
  passwordStrength,
};

export default PasswordValidator;
