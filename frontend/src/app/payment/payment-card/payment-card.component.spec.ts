import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentCardComponent } from './payment-card.component';
import { Stores } from '../../../../stores/Stores';
import { RouterTestingModule } from '@angular/router/testing';

// Mock pour Stores
const mockStores = {
  paymentStore: {
    factory: () => ({
      id: 0,
      userId: 0,
      amount: 0,
      type: 'deposit',
      status: 'pending',
      date: new Date(),
      iban: '',
      bic: '',
      accountHolderName: ''
    }),
    findById: jasmine.createSpy('findById').and.returnValue(Promise.resolve({
      id: 1,
      userId: 1,
      amount: 100,
      type: 'deposit',
      status: 'completed',
      date: new Date(),
      iban: 'IBAN123',
      bic: 'BIC123',
      accountHolderName: 'John Doe'
    }))
  }
};

describe('PaymentCardComponent', () => {
  let component: PaymentCardComponent;
  let fixture: ComponentFixture<PaymentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PaymentCardComponent,      // ✅ composant standalone : à importer, pas déclarer
        RouterTestingModule        // ✅ pour simuler le Router
      ],
      providers: [
        { provide: Stores, useValue: mockStores } // ✅ injection du mock
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentCardComponent);
    component = fixture.componentInstance;
    component.paymentId = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
