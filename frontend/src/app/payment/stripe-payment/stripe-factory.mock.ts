import { StripeInstance } from 'ngx-stripe';

export const mockStripeFactoryService = {
  create: () => {
    return {
        // Mock implementation of StripeInstance methods
        redirectToCheckout: () => {
            return Promise.resolve({ error: null });
        }
    } as unknown as StripeInstance;
  }
};
