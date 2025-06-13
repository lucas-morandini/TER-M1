import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { NgxStripeModule } from 'ngx-stripe';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(
      NgxStripeModule.forRoot('pk_test_51RN9lnQ186FnP1FmMMLTgENcTvzazPC7KnZ2KRbsZJMkHPeRAFskFQWiTyczm1O1m0EIKphBw7jEwFTruVqtnyhN00nyn8bnY6') // 👉 remplace par ta vraie clé publique Stripe
    )
  ]
};
