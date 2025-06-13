import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NgxStripeModule} from "ngx-stripe";
import { NavbarComponent } from "./basic/navbar/navbar.component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
}
