import { Component } from '@angular/core';
import { NavbarComponent } from "../../basic/navbar/navbar.component";
import { ProfileMenuComponent } from "../profile-menu/profile-menu.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [NavbarComponent, ProfileMenuComponent,RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

}
