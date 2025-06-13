import { NgxStripeModule } from "ngx-stripe";
import { AppComponent } from "./app.component";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { Stores } from "../../stores/Stores"; // Assurez-vous que le chemin est correct

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    NgxStripeModule.forRoot(),
    AppComponent
  ],
  providers: [Stores], // Ajoutez Stores ici
  // Removed bootstrap array as AppComponent is a standalone component
})
export class AppModule { }
