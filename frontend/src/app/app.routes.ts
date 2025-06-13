import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MatchBasicComponent } from './match/match-basic/match-basic.component';
import { LeagueListComponent } from './league/league-list/league-list.component';
import { MatchListComponent } from './match/match-list/match-list.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { BetListComponent } from './bet/bet-list/bet-list.component';
import { ProfileComponent } from './profile/profile-basic/profile.component';
import { CurrentBetsComponent } from './profile/current-bets/current-bets.component';
import { FinishedBetsComponent } from './profile/finished-bets/finished-bets.component';
import { InformationComponent } from './profile/information/information.component';
import { SelectionComponent } from './profile/selection/selection.component';
import { StripePaymentComponent } from './payment/stripe-payment/stripe-payment.component';
import { Page404Component } from './page-404/page-404.component';
import { PaymentValidationComponent } from './payment/payment-validation-component/payment-validation-component.component';
import { EditInformationComponent } from './user/user-editor/user-editor.component';
import { BetEditorComponent } from './bet/bet-editor/bet-editor.component';
import { PayBackComponent } from './payment/pay-back/pay-back.component';
import { NotificationListComponent } from './notification/notification-list/notification-list.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'match/:id', component: MatchBasicComponent },
    { path: 'league/:leagueId/matches', component: MatchListComponent },
    {path : 'notifications/:id', component:NotificationListComponent}, // Route pour les notifications
    { path: 'leagues', component: LeagueListComponent },
    { path: 'reset-password/:token', component: ResetPasswordComponent },
    { path: 'match/:id/bets', component: BetListComponent },
    {path: 'bet/:idBet/edit', component: BetEditorComponent}, // Route pour éditer un pari
    { path: 'profile', component: ProfileComponent, children: [
        { path: 'selection', component: SelectionComponent },
        {path: 'information/edit', component: EditInformationComponent},
        { path: 'information', component: InformationComponent },
        { path: 'current-bets', component: CurrentBetsComponent },
        { path: 'finished-bets', component: FinishedBetsComponent },
        { path: '', redirectTo: 'selection', pathMatch: 'full' },

    ]},
    { path: 'payment/stripe/validation', component: PaymentValidationComponent },
    {path: 'payment/stripe', component: StripePaymentComponent}, // Route pour le paiement Stripe
    {path: 'payment/payback', component: PayBackComponent}, // Route pour le remboursement
    { path: '**', component : Page404Component } // Rediriger vers la page d'accueil pour toute route inconnue
];
