import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarComponent } from '../../basic/navbar/navbar.component';
import { AuthService } from '../../auth.service';
import { User } from '../../../../commons/User';
import { Stores } from '../../../../stores/Stores';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import PasswordValidator from '../../shared/validators/password-validator.validator';

@Component({
  selector: 'app-user-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent], // ReactiveFormsModule au lieu de FormsModule
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss'],
  providers: [Stores]
})
export class EditInformationComponent implements OnInit {
  user: User | null = null;
  showPassword: boolean = false;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  showPasswordForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private stores: Stores,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeForms();
  }

  initializeForms(): void {
    // Formulaire principal des informations
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      sex: ['', [Validators.required]],
      birth_date: ['', [Validators.required]],
      tel: ['', [Validators.required]]
    });

    // Formulaire séparé pour le mot de passe
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, PasswordValidator.passwordStrength]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: PasswordValidator.passwordMatch
    });
  }

  async ngOnInit(): Promise<void> {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      const userStore = this.stores.userStore;
      this.user = await userStore.findById(userId);

      if (this.user) {
        // Pré-remplir le formulaire avec les données utilisateur
        this.profileForm.patchValue({
          username: this.user.username,
          email: this.user.email,
          name: this.user.name,
          first_name: this.user.first_name,
          sex: this.user.sex,
          birth_date: this.user.birth_date,
          tel: this.user.tel
        });
      }
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  togglePasswordForm(): void {
    this.showPasswordForm = !this.showPasswordForm;
    if (!this.showPasswordForm) {
      this.passwordForm.reset();
    }
  }

  async SaveData(): Promise<void> {
    if (this.profileForm.valid && this.user) {
      try {
        const formValues = this.profileForm.value;

        // Mettre à jour l'objet user avec les nouvelles valeurs
        this.user.username = formValues.username;
        this.user.email = formValues.email;
        this.user.name = formValues.name;
        this.user.first_name = formValues.first_name;
        this.user.sex = formValues.sex;
        this.user.birth_date = formValues.birth_date;
        this.user.tel = formValues.tel;

        const userStore = this.stores.userStore;
        await userStore.update(this.user);

        await swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Vos informations ont été mises à jour avec succès!',
          confirmButtonText: 'OK'
        });

        this.router.navigate(['/profile/information']);
      } catch (error) {
        await swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la mise à jour de vos informations.',
          confirmButtonText: 'OK'
        });
      }
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.profileForm.markAllAsTouched();

      await swal.fire({
        icon: 'warning',
        title: 'Formulaire invalide',
        text: 'Veuillez corriger les erreurs dans le formulaire.',
        confirmButtonText: 'OK'
      });
    }
  }

  async changePassword(): Promise<void> {
    if (this.passwordForm.valid) {
      try {
        const passwordValues = this.passwordForm.value;

        // Ici vous devrez implémenter la logique de changement de mot de passe
        // Exemple : await userStore.changePassword(userId, passwordValues.currentPassword, passwordValues.newPassword);

        await swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Votre mot de passe a été modifié avec succès!',
          confirmButtonText: 'OK'
        });

        this.togglePasswordForm();
      } catch (error) {
        await swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors du changement de mot de passe.',
          confirmButtonText: 'OK'
        });
      }
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }

  // Méthodes helper pour la validation
  hasFieldError(fieldName: string, formGroup: FormGroup = this.profileForm): boolean {
    const field = formGroup.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(fieldName: string, formGroup: FormGroup = this.profileForm): string {
    const field = formGroup.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `Ce champ est requis`;
      }
      if (field.errors['email']) {
        return 'Format d\'email invalide';
      }
      if (field.errors['minlength']) {
        return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
      }
    }
    return '';
  }

  // Méthodes pour la validation du mot de passe
  getPasswordErrors() {
    const passwordControl = this.passwordForm.get('newPassword');
    if (passwordControl?.errors && passwordControl.touched) {
      return passwordControl.errors;
    }
    return null;
  }

  hasPasswordMismatch() {
    return this.passwordForm.errors?.['passwordMismatch'] &&
           this.passwordForm.get('confirmPassword')?.touched;
  }
}
