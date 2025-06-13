import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss']
})
export class ProfileMenuComponent {
  constructor(private router: Router) {}

  navigateTo(path: string): void {
    this.router.navigate([`/profile/${path}`]); // Assurez-vous que le chemin est correct
  }
}
