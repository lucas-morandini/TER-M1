import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Stores } from "../../../../stores/Stores";
import { AuthService } from "../../auth.service";
import PasswordValidator from "../../shared/validators/password-validator.validator"; // Ajustez le chemin

@Component({
  selector: "app-modal-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ReactiveFormsModule au lieu de FormsModule
  templateUrl: "./modal-register.component.html",
  styleUrls: [],
  providers: [Stores],
})
export class ModalRegisterComponent {
  registerForm: FormGroup;

  @Output() closeModalEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private stores: Stores,
    private authService: AuthService,
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, PasswordValidator.passwordStrength]],
      confirmPassword: ['', [Validators.required]],
      birth_date: ['', [Validators.required]],
      tel: ['', [Validators.required]],
      sex: ['', [Validators.required]],
      name: ['', [Validators.required]],
      first_name: ['', [Validators.required]]
    }, {
      validators: PasswordValidator.passwordMatch // Validator au niveau du FormGroup
    });
  }

  async register() {
    if (this.registerForm.valid) {
      try {
        const formValues = this.registerForm.value;
        const userStore = this.stores.userStore;
        const response = await userStore.register(
          formValues.username,
          formValues.email,
          formValues.password,
          new Date(formValues.birth_date),
          formValues.tel,
          formValues.sex,
          formValues.name,
          formValues.first_name,
        );
        const user = response.user;
        const access_token = response.access_token;
        this.authService.login(access_token,user?.id ?? -1);
        this.closeModal();
      } catch (error) {
        console.error("Failed to register:", error);
      }
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.registerForm.markAllAsTouched();
    }
  }

  closeModal() {
    console.log("Close modal event emitted");
    this.closeModalEvent.emit();
  }

  // Méthodes helper pour l'affichage des erreurs
getPasswordErrors() {
  const passwordControl = this.registerForm.get('password');
  if (passwordControl?.errors && passwordControl.touched) {
    return passwordControl.errors;
  }
  return null;
}

hasPasswordMismatch() {
  return this.registerForm.errors?.['passwordMismatch'] &&
         this.registerForm.get('confirmPassword')?.touched;
}
}
