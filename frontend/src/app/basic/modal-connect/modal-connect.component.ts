import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Stores } from "../../../../stores/Stores";
import swal from "sweetalert2";
import { AuthService } from "../../auth.service";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-modal-connect",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ReactiveFormsModule au lieu de FormsModule
  templateUrl: "./modal-connect.component.html",
  styleUrls: [],
  providers: [Stores],
})
export class ModalConnectComponent {
  loginForm: FormGroup;

  @Output() closeModalEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private stores: Stores,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      remember: [false] // Pour la checkbox "Se souvenir de moi"
    });
  }

  async connect() {
    if (this.loginForm.valid) {
      try {
        const formValues = this.loginForm.value;
        const userStore = this.stores.userStore;
        const response = await userStore.connect(formValues.email, formValues.password);
        const user = response.user;
        const access_token = response.access_token;
        this.authService.login(access_token,user?.id ?? -1);
        if(!user) {swal.fire("Erreur", "Erreur dans votre email ou mdp veuillez re-essayer", "warning"); return;}
        console.log("User connected:", user.id);
        //this.userService.updateBetStatus(user); TODO DEPRECATED
      this.userService.afficheUserNotifications(user); // TODO: Handle notifications

      this.closeModal();
      } catch (error) {
        console.error("Failed to connect:", error);
        const errorMessage = (error as any)?.message || "Une erreur est survenue";
        swal.fire("Erreur", errorMessage, "error");
      }
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.loginForm.markAllAsTouched();
    }
  }

  closeModal() {
    console.log("Close modal event emitted");
    this.closeModalEvent.emit();
  }

  async lostPassword() {
    const emailValue = this.loginForm.get('email')?.value;

    if (!emailValue) {
      swal.fire("Erreur", "Veuillez entrer votre email pour réinitialiser votre mot de passe", "warning");
      return;
    }

    try {
      const userStore = this.stores.userStore;
      const res = await userStore.lostPassword(emailValue);
      if (!res.code) {
        swal.fire("Error", res.message ?? "An error occurred", "error");
        return;
      }
      swal.fire("Email sent", "An email has been sent to reset your password", "success");
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  // Méthodes helper pour la validation
  hasFieldError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return fieldName === 'email' ? 'L\'email est requis' : 'Le mot de passe est requis';
      }
      if (field.errors['email']) {
        return 'Format d\'email invalide';
      }
    }
    return '';
  }
}
