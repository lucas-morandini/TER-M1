import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Stores } from '../../../stores/Stores';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [Stores],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  token!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private stores: Stores
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });

    this.route.paramMap.subscribe(params => {
      this.token = params.get('token')!;
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    return formGroup.get('password')!.value === formGroup.get('confirmPassword')!.value
      ? null : { mismatch: true };
  }

  async onSubmit(): Promise<void> {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    const userStore = this.stores.userStore;
    try {
      await userStore.resetPassword(this.token, this.resetPasswordForm.value.password);

      // Connexion de l'utilisateur après la réinitialisation du mot de passe
      await userStore.connect(this.resetPasswordForm.value.username, this.resetPasswordForm.value.password);

      // Redirection vers la page d'accueil
      let UserStore = this.stores.userStore;
      UserStore.connect(this.resetPasswordForm.value.username, this.resetPasswordForm.value.password);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error resetting password:', error);
      let errorMessage = 'Something went wrong!';

      // Vérifiez si l'erreur est une réponse HTTP avec un statut 404
      const err = error as any;
      if (err.status === 404) {
        errorMessage = 'User not found or invalid token.';
      } else if (err.error) {
        errorMessage = err.error;
      }

      // Afficher un message d'erreur avec SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
    }
  }
}
