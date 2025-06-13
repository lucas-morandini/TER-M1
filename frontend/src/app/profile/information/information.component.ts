import { Component, OnInit } from '@angular/core';
import { Stores } from '../../../../stores/Stores';
import { User } from '../../../../commons/User';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../basic/navbar/navbar.component';
import { ProfileMenuComponent } from '../profile-menu/profile-menu.component';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { PaymentListComponent } from '../../payment/payment-list/payment-list.component';
import { Payment } from '../../../../commons/Payment';

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ProfileMenuComponent, PaymentListComponent],
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
  providers: [Stores]
})
export class InformationComponent implements OnInit {
  user: User | null = null;
  showPassword: boolean = false;
  showPaymentHistory: boolean = false;
  userPayments: Payment[] = []; // Propriété pour stocker les paiements de l'utilisateur

  constructor(
    private stores: Stores,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      const userStore = this.stores.userStore;
      this.user = await userStore.findById(userId);

      // Chargez les paiements de l'utilisateur
      const paymentStore = this.stores.paymentStore;
      this.userPayments = await paymentStore.findByUserId(userId);
    }
  }

  redirectToPayment(): void {
    window.location.href = '/payment/stripe';
  }

  redirectToPayBack(): void {
    window.location.href = '/payment/payback';
  }

  navigateToEditProfile(): void {
    window.location.href = '/profile/information/edit';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  showPaymentHistoryTab(): void {
    this.showPaymentHistory = true;
  }

  showUserInformationTab(): void {
    this.showPaymentHistory = false;
  }
}
