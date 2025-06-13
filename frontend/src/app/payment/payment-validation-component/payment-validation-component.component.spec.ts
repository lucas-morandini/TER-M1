import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { Stores } from '../../../../stores/Stores';
import swal from 'sweetalert2';
import { PaymentValidationComponent } from './payment-validation-component.component';

// Mock pour ActivatedRoute
class MockActivatedRoute {
  snapshot = {
    queryParamMap: {
      get: (key: string) => 'mock-hash'
    }
  };
}

// Mock pour Router
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

// Mock pour Stores
class MockStores {
  userStore = {
    isPaymentValidate: jasmine.createSpy('isPaymentValidate').and.returnValue(Promise.resolve(true))
  };
}

describe('PaymentValidationComponent', () => {
  let component: PaymentValidationComponent;
  let fixture: ComponentFixture<PaymentValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentValidationComponent],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: Router, useClass: MockRouter },
        { provide: Stores, useClass: MockStores }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
