declare global {
  interface Window {
    Stripe: any;
  }
}

let stripe: any = null;

export const initializeStripe = () => {
  if (!stripe && window.Stripe) {
    stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');
  }
  return stripe;
};

export const confirmPayment = async (clientSecret: string, paymentMethod: any) => {
  const stripeInstance = initializeStripe();
  if (!stripeInstance) {
    throw new Error('Stripe not initialized');
  }

  return stripeInstance.confirmPayment({
    payment_method: paymentMethod,
    confirmParams: {
      return_url: `${window.location.origin}/dashboard`,
    },
  });
};

export const createPaymentMethod = async (cardElement: any) => {
  const stripeInstance = initializeStripe();
  if (!stripeInstance) {
    throw new Error('Stripe not initialized');
  }

  return stripeInstance.createPaymentMethod({
    type: 'card',
    card: cardElement,
  });
};
