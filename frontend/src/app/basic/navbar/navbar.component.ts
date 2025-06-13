import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Stores } from '../../../../stores/Stores';
import { ModalConnectComponent } from '../modal-connect/modal-connect.component';
import { ModalRegisterComponent } from '../modal-register/modal-register.component';
import { AuthService } from '../../auth.service';
import { Match } from '../../../../commons/Match';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ModalConnectComponent, ModalRegisterComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [Stores]
})
export class NavbarComponent implements OnInit {
  is_dropdown_open: boolean = false;
  showModal: boolean = false;
  showModalRegister: boolean = false;
  matchOfTheWeek: Match | undefined;
  userBalance: number | null = null;

  constructor(
    private stores: Stores,
    private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('NavbarComponent - Navigation change');
        this.updateUserBalance();
      }
    });

    // Récupérer le match de la semaine
    this.matchOfTheWeek = await this.stores.matchStore.getMatchOfTheWeek();
  }

  get isConnected(): boolean {
    return this.authService.isLoggedIn();
  }

  async updateUserBalance(): Promise<void> {
    if (this.isConnected) {
      const userId = this.authService.getUserId();
      if (userId !== null) {
        const userStore = this.stores.userStore;
        const user = await userStore.findById(userId);
        this.userBalance = user.solde;
      }
    }
  }

  redirectToMyNotifications() {
    this.router.navigate(['/notifications/'+this.authService.getUserId()]);
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  openModalRegister() {
    this.showModalRegister = true;
  }

  closeModalRegister() {
    this.showModalRegister = false;
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  logout() {
    this.authService.logout();
    this.is_dropdown_open = false;
  }

  toggleDropdown() {
    this.is_dropdown_open = !this.is_dropdown_open;
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  navigateToPayment(): void {
    this.router.navigate(['/payment/stripe']);
  }

  closeDropdown() {
    this.is_dropdown_open = false;
  }
}
