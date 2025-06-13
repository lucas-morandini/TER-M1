import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeFactoryService } from 'ngx-stripe';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { mockStripeFactoryService } from '../../payment/stripe-payment/stripe-factory.mock';
import { StripePaymentComponent } from '../../payment/stripe-payment/stripe-payment.component';

describe('StripePaymentComponent', () => {
  let component: StripePaymentComponent;
  let fixture: ComponentFixture<StripePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StripePaymentComponent, HttpClientTestingModule],
      providers: [
        { provide: StripeFactoryService, useValue: mockStripeFactoryService } // Fournir le mock
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StripePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
